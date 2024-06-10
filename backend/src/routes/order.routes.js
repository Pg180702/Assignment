const express = require("express");
const router = express.Router();
const order = require("../controllers/order.controllers");
router.route("/new-order").post(order.newOrder);
module.exports = router;
