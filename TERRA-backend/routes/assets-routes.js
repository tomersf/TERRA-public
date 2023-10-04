const express = require("express");
const { check } = require("express-validator");

const assetsControllers = require("../controllers/assets-controllers");
const { fileUpload } = require("../middleware/file-upload");

const router = express.Router();

router.get("/image/:fileKey", assetsControllers.getAssetImageByKey);

router.get("/user/:uid", assetsControllers.getAssetsByUserId);

router.get(
  "/avilability/:aid/:day/:month/:year",
  assetsControllers.getAssetAvilabilityByIdAndDate
);

router.get("/detail/:aid", assetsControllers.getAssetById);

router.get("/", assetsControllers.getAssets);

router.patch(
  "/edit",
  fileUpload.single("image"),
  [
    check("pictureChanged").notEmpty(),
    check("assetId").notEmpty(),
    check("userId").notEmpty(),
    check("description").isLength({ min: 10 }),
    check("price").not().isEmpty().isNumeric(),
  ],
  assetsControllers.editAsset
);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("userId").not().isEmpty(),
    check("assetType").not().isEmpty(),
    check("description").isLength({ min: 10 }),
    check("price").not().isEmpty().isNumeric(),
    check("location_lat").not().isEmpty(),
    check("location_lng").not().isEmpty(),
    check("activityHours_start").not().isEmpty().isLength({ min: 5, max: 5 }),
    check("activityHours_end").not().isEmpty().isLength({ min: 5, max: 5 }),
  ],
  assetsControllers.createAsset
);

router.delete("/:aid", assetsControllers.deleteAsset);

module.exports = router;
