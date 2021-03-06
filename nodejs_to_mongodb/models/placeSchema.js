const mongoose = require("mongoose");

const placeSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: false },
    lng: { type: Number, required: false },
  },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Place", placeSchema); //1=>collection name or table name in db 2=>schema we created
