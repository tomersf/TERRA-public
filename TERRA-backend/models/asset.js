const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const assetSchema = new Schema({
  assetType: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  activityHours: { type: Object, required: true },
  price: { type: Number, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  ownerPushToken: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Asset", assetSchema);
