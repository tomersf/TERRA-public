const { validationResult } = require("express-validator");
const CustomError = require("../models/custom-error");
const Asset = require("../models/asset");
const User = require("../models/user");
const Booking = require("../models/booking");
const moment = require("moment");

const getAllBookings = async (req, res, next) => {
  const userId = req.params.userId;
  let user;
  let bookings;

  try {
    await removeOldBookings(userId);
  } catch (err) {
    return next(new CustomError("Could not remove old bookings of user.", 422));
  }

  try {
    user = await User.findById(userId);
    bookings = await Booking.find({ booker: userId }).populate("asset");
  } catch (err) {
    const error = new CustomError(
      "Something went wrong, could not find a user.",
      500
    );
    return next(error);
  }

  if (!user || !bookings) {
    const error = new CustomError(
      "Could not find user / bookings for the provided id.",
      404
    );
    return next(error);
  }

  res.json({
    bookings: bookings.map((booking) => booking.toObject({ getters: true })),
  });
};

const createBooking = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new CustomError("Invalid inputs passed, please check your data.", 422)
    );
  }

  // hours should be in the format 'HH:MM-HH:MM,HH:MM-HH:MM'
  const { booker: userId, assetId, hours, date } = req.body;
  let hoursArray = hours.split(",");
  let bookedDate;
  let formattedDate;
  const [month, day, year] = date.split("/");
  try {
    bookedDate = new Date(year, +month - 1, +day + 1);
    formattedDate = moment(new Date(year, +month - 1, day)).format(
      "DD/MM/YYYY"
    );
  } catch (err) {
    return next(err);
  }

  // Can only book for a future date
  if (new Date().getTime() >= bookedDate.getTime()) {
    return next(new CustomError("Invalid date passed! try again.", 422));
  }

  let user;
  let asset;
  try {
    user = await User.findById(userId);
    asset = await Asset.findById(assetId);
  } catch (err) {
    return next(err);
  }

  if (!user || !asset) {
    return next(
      new CustomError("Invalid user / asset, could not create booking", 422)
    );
  }

  const createdBooking = new Booking({
    booker: userId,
    asset: assetId,
    hours: hoursArray,
    date: bookedDate,
    assetPriceWhenBooked: asset.price,
    formattedDate: formattedDate,
  });

  let booking;
  try {
    const isExistingBooking = await Booking.findOne({
      booker: userId,
      asset: assetId,
      formattedDate: formattedDate,
    });
    if (isExistingBooking) {
      for (const hour of isExistingBooking.hours) {
        if (hoursArray.indexOf(hour) > -1) {
          return next(new CustomError("Booking already exists!"), 422);
        }
      }
    }
    booking = await createdBooking.save();
  } catch (err) {
    return next(new CustomError("Couldn't create booking!", 422));
  }

  try {
    await removeOldBookings(userId);
  } catch (err) {
    return next(new CustomError("Could not remove old bookings of user.", 422));
  }

  res.status(201).json({ booking });
};

const removeOldBookings = async (userId) => {
  let date = new Date();
  date.setMonth(date.getMonth() - 1);
  const oldBookings = await Booking.find({
    booker: userId,
    date: { $lte: date },
  });
  for (const booking of oldBookings) {
    await booking.remove();
  }
};

exports.createBooking = createBooking;
exports.getAllBookings = getAllBookings;
