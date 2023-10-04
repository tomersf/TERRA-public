const express = require("express");
const { check } = require("express-validator");

const ordersControllers = require("../controllers/orders-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/:date", ordersControllers.getOrdersByDate);
router.get("/", ordersControllers.getOrders);
router.get("/month/:monthNumber", ordersControllers.getAllMonthOrders);

module.exports = router;
