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

app.get('/test', (req, res) => {
  res.json('test ok');
});

app.post('/register', async (req, res) => {
  const {name, email, password} = req.body;

  try{
    const userDoc = await User.create({
    name,
    email,
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

app.post('/login', async (req,res) => {
  const {email,password} = req.body;
  const userDoc = await User.findOne({email});
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
        jwt.sign({
          email: userDoc.email, 
          id: userDoc._id}, 
          jwtSecret, {}, (err, token) => {
          if (err) throw err;
          res.cookie('token', token).json(userDoc);
        });
    } else {
      res.status(422).json('pass not ok');
    } 
  } else {
    res.json('not found');
  }
});

app.get('/profile', (req,res) => {
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const {name, email, _id} = await User.findById(userData.id);
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
    checkIn, checkOut, maxGuests
  } = req.body;
  if (!token) {
    return res.status(401).json('not logged in');
  }
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id,
      title, address, addedPhotos, 
      description, perks, extraInfo, 
      checkIn, checkOut, maxGuests
    });
    res.json(placeDoc);
  });
});

app.listen(4000);

