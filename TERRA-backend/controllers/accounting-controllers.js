const CustomError = require("../models/custom-error");
const User = require("../models/user");
const Booking = require("../models/booking");
const assetTypes = require("../util/assets-types");

const getAccountingOfUser = async (req, res, next) => {
  const userId = req.params.userId;
  let user;
  let userBookings = [];
  let orderedBookingsOfUserAssets = [];
  let incomeObj = { total: 0 };
  let outcomeObj = { total: 0 };
  try {
    user = await User.findById(userId);
    orderedBookingsOfUserAssets = await Booking.find()
      .where("asset")
      .in(user.assets)
      .populate("asset");
    userBookings = await Booking.find({ booker: userId }).populate("asset");
  } catch (err) {
    return next(err);
  }

  if (!user) {
    return next(new CustomError("Invalid user id", 403));
  }

  if (userBookings.length == 0 && orderedBookingsOfUserAssets == 0) {
    return res.status(200).json({ outcomeObj, incomeObj });
  }

  const colorMap = {};
  for (let key in assetTypes) {
    colorMap[key] = getRandomRgb();
  }

  if (!userBookings.length == 0) {
    outcomeObj = userBookings.reduce(
      (obj, booking) => {
        const price = booking.assetPriceWhenBooked;
        const assetType = booking.asset.assetType;
        obj.total += price;
        if (obj.assetsIdMapCounter[booking.asset.id]) {
          obj.assetsIdMapCounter[booking.asset.id] += 1;
        } else {
          obj.assetsIdMapCounter[booking.asset.id] = 1;
        }
        if (obj.assetsData[assetType]) {
          obj.assetsData[assetType].count++;
          obj.assetsData[assetType].total += price;
        } else {
          obj.assetsData[assetType] = {
            count: 1,
            total: price,
            color: colorMap[assetType],
          };
        }
        return obj;
      },
      { total: 0, assetsData: {}, assetsIdMapCounter: {} }
    );
  }

  if (!orderedBookingsOfUserAssets.length == 0) {
    incomeObj = orderedBookingsOfUserAssets.reduce(
      (obj, booking) => {
        const price = booking.assetPriceWhenBooked;
        const assetType = booking.asset.assetType;
        obj.total += price;
        if (obj.assetsIdMapCounter[booking.asset.id]) {
          obj.assetsIdMapCounter[booking.asset.id] += 1;
        } else {
          obj.assetsIdMapCounter[booking.asset.id] = 1;
        }
        if (obj.assetsData[assetType]) {
          obj.assetsData[assetType].count++;
          obj.assetsData[assetType].total += price;
        } else {
          obj.assetsData[assetType] = {
            count: 1,
            total: price,
            color: colorMap[assetType],
          };
        }
        return obj;
      },
      { total: 0, assetsData: {}, assetsIdMapCounter: {} }
    );
  }

  return res.status(200).json({ outcomeObj, incomeObj });
};

const getRandomRgb = () => {
  const num = Math.round(0xffffff * Math.random());
  const r = num >> 16;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return "rgb(" + r + ", " + g + ", " + b + ")";
};

exports.getAccountingOfUser = getAccountingOfUser;
