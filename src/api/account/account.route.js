const express = require("express");
const router = express.Router();

const controller = require("./account.controller");

router.get("/account/balance_history", controller.getBalanceHistory);

module.exports = router;
