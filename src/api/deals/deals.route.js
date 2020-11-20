const express = require("express");
const router = express.Router();

const controller = require("./deals.controller");

router.get("/deals/:id", controller.getOne);
router.get("/deals", controller.getList);

module.exports = router;
