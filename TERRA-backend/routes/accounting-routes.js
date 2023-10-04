const express = require("express");

const accountingControllers = require("../controllers/accounting-controllers");

const router = express.Router();

router.get("/:userId", accountingControllers.getAccountingOfUser);

module.exports = router;
