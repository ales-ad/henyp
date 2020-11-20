const express = require("express");
const router = express.Router();

const controller = require("./orders.controller");

router.get("/orders/:id", controller.getOne);
router.get("/orders", controller.getList);

module.exports = router;
