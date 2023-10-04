const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  hours: [{ type: String, required: true }],
  booker: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  asset: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Asset",
  },
  date: {
    type: Date,
    required: true,
  },
  formattedDate: {
    type: String,
    required: true,
  },
  assetPriceWhenBooked: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
