const fs = require("fs");
const path = require("path");

const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");

const assetsRoutes = require("./routes/assets-routes");
const usersRoutes = require("./routes/users-routes");
const bookingsRoutes = require("./routes/bookings-routes");
const accountingRoutes = require("./routes/accounting-routes");
const CustomError = require("./models/custom-error");

app.use(express.json());
app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/assets", assetsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/accounting", accountingRoutes);

app.use((req, res, next) => {
  const error = new CustomError("Could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(app.listen(port), () => {})
  .catch((err) => {
    console.log(err);
  });
