const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String },
  address: { type: String },
  photos: { type: [String] },
  description: { type: String },
  perks: { type: [String] },
  extraInfo: { type: String },
  checkIn: { type: String },
  checkOut: { type: String },
  maxGuests: { type: Number },
  price: { type: Number },
});

const PlaceModel = mongoose.model('Place', placeSchema);

module.exports = PlaceModel;
