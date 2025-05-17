// server/models/Airline.js
const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  airlineName: { type: String, required: true },
  iataCode: { type: String, required: true },
  icaoCode: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  districtCode: { type: Number, required: true },
});

module.exports = mongoose.model("Profile", profileSchema);
