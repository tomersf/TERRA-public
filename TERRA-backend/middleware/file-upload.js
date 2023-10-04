const multer = require("multer");
const fs = require("fs");
const uuid = require("uuid");
const path = require("path");
const S3 = require("aws-sdk/clients/s3");
const CustomError = require("../models/custom-error");

const bucketName = "terra-bucket2";
const region = "us-east-1";
const accessKeyId = process.env.AWS_S3_ACCESS_KEY;
const secretAccessKey = process.env.AWS_S3_SECRET_KEY;

const s3 = new S3({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// upload a file to S3
const uploadFile = async (file) => {
  try {
    const uploadParams = {
      Bucket: bucketName,
      Body: fs.readFileSync(file.path),
      Key: file.filename,
      ACL: "public-read",
    };
    return s3.upload(uploadParams).promise();
  } catch (err) {
    throw CustomError("Unable to save image to database!", 404);
  }
};

// delete file from s3
const deleteFile = async (file) => {
  try {
    const deleteParams = {
      Bucket: bucketName,
      Key: file,
    };
    return s3.deleteObject(deleteParams).promise();
  } catch (err) {
    throw CustomError("Unable to delete old image of asset from database!");
  }
};

// download a file from S3
const getFileStream = (fileKey) => {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };
  return s3.getObject(downloadParams).createReadStream();
};

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const fileUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const pathy = path.join("uploads", "images");
      if (!fs.existsSync(pathy)) {
        fs.mkdirSync(pathy, { recursive: true });
        cb(null, pathy);
      } else {
        cb(null, pathy);
      }
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuid.v4() + "." + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid mime type!");
    cb(error, isValid);
  },
});

exports.deleteFile = deleteFile;
exports.fileUpload = fileUpload;
exports.uploadFile = uploadFile;
exports.getFileStream = getFileStream;
