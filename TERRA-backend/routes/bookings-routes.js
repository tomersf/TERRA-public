const express = require("express");
const { check } = require("express-validator");

const bookingsController = require("../controllers/bookings-controllers");

const router = express.Router();

router.get("/:userId", bookingsController.getAllBookings);

router.post(
  "/",
  [
    check("booker").notEmpty(),
    check("assetId").notEmpty(),
    check("hours").notEmpty(),
    check("date").notEmpty(),
  ],
  bookingsController.createBooking
);

module.exports = router;
