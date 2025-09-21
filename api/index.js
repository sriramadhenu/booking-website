const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User');
const app = express();
const jwt = require('jsonwebtoken');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const fs = require('fs');
const Place = require('./models/Place');
const Booking = require('./models/Booking');

require('dotenv').config();
app.use(express.json());

const cookieParser = require('cookie-parser');
const jwtSecret = 'faslkdjfwreioutpoirwer';

app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173'
}));

mongoose.connect(process.env.MONGO_URL);

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies.token;
    if (!token) {
      return resolve(null);
    }
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) return reject(err);
      resolve(userData);
    });
  });
}


app.get('/test', (req, res) => {
  res.json('test ok');
});

app.post('/register', async (req, res) => {
  const {name, email, password} = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  try{
    const userDoc = await User.create({
      name,
      email: normalizedEmail,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    });

    res.json(userDoc);
  } catch(e) {
    if (e.code === 11000){
      res.status(422).json('Email is already registered');
    } else {
      res.status(500).json('Internal server error');
    }
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  const userDoc = await User.findOne({ email: normalizedEmail });
  if (!userDoc) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (!passOk) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  jwt.sign(
    { email: userDoc.email, id: userDoc._id },
    jwtSecret,
    {},
    (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json(userDoc);
    }
  );
});


app.get('/profile', (req,res) => {
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        return res.status(401).json('invalid token');
      }
      const user = await User.findById(userData.id);
      if (!user) {
        return res.status(404).json('user not found');
      }
      const {name, email, _id} = user;
      res.json({name, email, _id});
    });
  } else {
    res.json(null);
  }
});

app.post('/logout', (req,res) => {
  res.cookie('token', '').json(true);
});

app.post('/upload-by-link', async (req, res) => {
  const {link} = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  await imageDownloader.image({
    url: link,
    dest: __dirname + '/uploads/' + newName,
  })
  res.json(newName);
});

app.post('/upload', upload.array('photos', 50), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const {path, originalname} = req.files[i];
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace('uploads/', ''));
  }
  res.json(uploadedFiles);
});

app.post('/places', (req, res) => {
  const {token} = req.cookies;
  const {
    title, address, addedPhotos, 
    description, perks, extraInfo, 
    checkIn, checkOut, maxGuests, price
  } = req.body;
  if (!token) {
    return res.status(401).json('not logged in');
  }
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json('invalid token');
    const placeDoc = await Place.create({
      owner: userData.id,
      title, address, photos:addedPhotos, 
      description, perks, extraInfo, 
      checkIn, checkOut, maxGuests, price
    });
    res.json(placeDoc);
  });
});

app.get('/places', (req, res) => {
  const {token} = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json('invalid token');
    const {id} = userData;
    res.json(await Place.find({owner:id}));
  })
})

app.get('/places/:id', async (req, res) => {
  const {id} = req.params;
  res.json(await Place.findById(id));
})

app.put('/places/', async (req,res) => {
  const {token} = req.cookies;
  const {
    id, title, address, addedPhotos, 
    description, perks, extraInfo, 
    checkIn, checkOut, maxGuests, price
  } = req.body;
  
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json('invalid token');
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()){
      placeDoc.set({
        title, address, photos:addedPhotos, 
        description, perks, extraInfo, 
        checkIn, checkOut, maxGuests, price
      });
      await placeDoc.save();
      res.json('ok');
    }
  });
});

app.get('/places', async (req,res) => {
  res.json(await Place.find());
});

app.post('/bookings', async (req, res) => {
  const userData = await getUserDataFromReq(req);
  const {place, checkIn, checkOut, 
    numberOfGuests, name, phone, price} = req.body;
  Booking.create({
    place, checkIn, checkOut, 
    numberOfGuests, name, phone, price,
    user:userData.id,
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    console.error(err);
    res.status(500).json('Server error during booking creation');
  });
});

app.get('/bookings', async (req,res) => {
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({user:userData.id}).populate('place'));
});

app.listen(4000);
