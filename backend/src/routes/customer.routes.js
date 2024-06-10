const express = require("express");
const router = express.Router();
const customer = require("../controllers/customer.controllers");
router.route("/new-customer").post(customer.newCustomer);
router.route("/refresh-visit").post(customer.newVisit);
module.exports = router;
