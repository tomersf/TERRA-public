const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const moment = require("moment");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const CustomError = require("../models/custom-error");
const getAddressForCoords = require("../util/location");
const Asset = require("../models/asset");
const User = require("../models/user");
const Order = require("../models/order");
const Booking = require("../models/booking");
const { createTimeSlots, avilableSlots } = require("../util/time");
const assetsTypes = require("../util/assets-types");
const {
  uploadFile,
  getFileStream,
  deleteFile,
} = require("../middleware/file-upload");
const { isToday } = require("../util/misc");

const getAssets = async (req, res, next) => {
  let assets = [];
  try {
    assets = await Asset.find();
  } catch (err) {
    const error = new CustomError(
      "Something went wrong, could not fetch assets.",
      500
    );
    return next(error);
  }

  res.json({
    assets: assets.map((asset) => asset.toObject({ getters: true })),
  });
};

const getAssetImageByKey = (req, res) => {
  const key = req.params.fileKey;
  const readStream = getFileStream(key);
  readStream.pipe(res);
};

const getAssetById = async (req, res, next) => {
  const assetId = req.params.aid;

  let asset;
  try {
    asset = await Asset.findById(assetId);
  } catch (err) {
    const error = new CustomError(
      "Something went wrong, could not find a asset.",
      500
    );
    return next(error);
  }

  if (!asset) {
    const error = new CustomError(
      "Could not find place for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ asset: asset.toObject({ getters: true }) });
};

const getAssetAvilabilityByIdAndDate = async (req, res, next) => {
  console.log("getting asset avilability...");
  let timeSlots;
  let start_time;
  const assetId = req.params.aid;
  const day = req.params.day;
  const month = req.params.month;
  const year = req.params.year;
  const requestedDate = new Date(year, +month - 1, +day + 1);
  const formattedDate = moment(new Date(year, +month - 1, day)).format(
    "DD/MM/YYYY"
  );
  console.log(formattedDate);
  const todayDate = new Date();

  if (todayDate.getTime() > requestedDate.getTime()) {
    const error = new CustomError(
      "Make sure the selected date is in the future.",
      500
    );
    return next(error);
  }

  let asset;
  try {
    asset = await Asset.findById(assetId);
  } catch (err) {
    const error = new CustomError(
      "Something went wrong, could not find a asset.",
      500
    );
    return next(error);
  }

  if (!asset) {
    const error = new CustomError(
      "Could not find place for the provided id.",
      404
    );
    return next(error);
  }

  if (isToday(requestedDate)) {
    let currHour = todayDate.getUTCHours() + 3;
    currHour = ("0" + currHour).slice(-2);
    currHour = moment(currHour, "HH:mm");
    let activityHourStart = moment(asset.activityHours.start, "HH:mm");
    console.log("ACTIVITY START HOUR: ", activityHourStart);
    let totalHours =
      parseInt(moment.utc(currHour.diff(activityHourStart)).format("HH")) + 1;
    console.log("TOTAL HOURS IS : ", totalHours);
    start_time = activityHourStart.add(totalHours, "hours");
    console.log("START TIME IS : ", totalHours);
  } else {
    start_time = asset.activityHours.start;
  }

  const end_time = asset.activityHours.end;
  timeSlots = createTimeSlots(start_time, end_time);

  let bookings;
  try {
    let count = await Booking.countDocuments();
    if (count > 0) {
      bookings = await Booking.find({
        formattedDate: formattedDate,
        asset: assetId,
      });
    }
  } catch (err) {
    const error = new CustomError(
      "Could not find bookings for the provided date.",
      404
    );
    return next(error);
  }

  if (!bookings) {
    return res.json({ slots: timeSlots });
  }

  const assetTakenHours = bookings.map((booking) => booking.hours);
  if (assetTakenHours.length == 0) {
    return res.json({ slots: timeSlots });
  }
  console.log(assetTakenHours);

  const flattedArrayOfTimeSlots = assetTakenHours.flat();
  timeSlots = avilableSlots(flattedArrayOfTimeSlots, timeSlots);
  res.json({ slots: timeSlots });
};

const getAssetsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithAssets;
  try {
    userWithAssets = await User.findById(userId).populate("assets");
  } catch (err) {
    const error = new CustomError(
      "Fetching assets failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!userWithAssets) {
    return next(
      new CustomError("Could not retrieve data about your user!", 404)
    );
  }

  res.json({
    assets: userWithAssets.assets.map((asset) =>
      asset.toObject({ getters: true })
    ),
  });
};

const createAsset = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new CustomError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    userId,
    assetType,
    description,
    location_lng,
    location_lat,
    price,
    activityHours_start,
    activityHours_end,
  } = req.body;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new CustomError(
      "Creating asset failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new CustomError("Could not find user for provided id.", 404);
    return next(error);
  }

  let assetLocation;

  try {
    assetLocation = await getAddressForCoords(location_lat, location_lng);
  } catch (error) {
    return next(error);
  }

  if (!Object.values(assetsTypes).includes(assetType)) {
    return next(new CustomError("Invalid asset type!", 422));
  }

  const file = req.file;
  const s3Response = await uploadFile(file);
  await unlinkFile(file.path);

  const location = {
    lat: location_lat,
    lng: location_lng,
  };

  const activityHours = {
    start: activityHours_start,
    end: activityHours_end,
  };

  const createdAsset = new Asset({
    assetType,
    description,
    address: assetLocation.assetAddress,
    city: assetLocation.assetCity,
    location,
    image: `https://terras.herokuapp.com/api/assets/image/${s3Response.Key}`,
    creator: userId,
    price,
    activityHours,
    ownerPushToken: user.pushToken,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdAsset.save({ session: sess });
    user.assets.push(createdAsset);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new CustomError(
      "Creating asset failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ asset: createdAsset });
};

const editAsset = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new CustomError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { description, userId, assetId, price, pictureChanged } = req.body;
  const file = req.file;
  let asset;

  try {
    asset = await Asset.findById(assetId);
  } catch (err) {
    const error = new CustomError(
      "Something went wrong, could not update asset.",
      500
    );
    return next(error);
  }

  if (asset == undefined) {
    return next(new CustomError("Asset was not found!", 402));
  }

  if (asset.creator.toString() !== userId) {
    const error = new CustomError(
      "You are not allowed to edit this asset.",
      401
    );
    return next(error);
  }

  if (pictureChanged == "true") {
    try {
      const s3Response = await uploadFile(file);
      await deleteFile(asset.image.split("/").pop());
      asset.image = `https://terras.herokuapp.com/api/assets/image/${s3Response.Key}`;
    } catch (err) {
      next(err);
    }
  }

  try {
    await unlinkFile(file.path);
  } catch (err) {
    return next(err);
  }

  asset.description = description;
  asset.price = +price;

  try {
    await asset.save();
  } catch (err) {
    const error = new CustomError(
      "Something went wrong, could not update asset.",
      500
    );
    return next(error);
  }

  res.status(200).json({ asset: asset.toObject({ getters: true }) });
};

const deleteAsset = async (req, res, next) => {
  const assetId = req.params.aid;

  let asset;
  try {
    asset = await Asset.findById(assetId).populate("creator");
  } catch (err) {
    const error = new CustomError(
      "Something went wrong, could not delete asset.",
      500
    );
    return next(error);
  }

  if (!asset) {
    const error = new CustomError("Could not find asset for this id.", 404);
    return next(error);
  }

  if (asset.creator.id !== req.userData.userId) {
    const error = new CustomError(
      "You are not allowed to delete this asset.",
      401
    );
    return next(error);
  }

  const imagePath = asset.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await asset.remove({ session: sess });
    place.creator.assets.pull(place);
    await asset.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new CustomError(
      "Something went wrong, could not delete asset.",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Deleted asset." });
};

exports.editAsset = editAsset;
exports.getAssetById = getAssetById;
exports.getAssetsByUserId = getAssetsByUserId;
exports.createAsset = createAsset;
exports.deleteAsset = deleteAsset;
exports.getAssetAvilabilityByIdAndDate = getAssetAvilabilityByIdAndDate;
exports.getAssets = getAssets;
exports.getAssetImageByKey = getAssetImageByKey;
