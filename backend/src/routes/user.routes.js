const express = require("express");
const router = express.Router();
const user = require("../controllers/user.controllers");

router.route("/register").post(user.register);
router.route("/login").post(user.login);
router.route("/audience").post(user.audienceCheck);
router.route("/delivery").post(user.deliveryReceiptApi);
router.route("/campaign-message").post(user.campaignMessage);
router.route("/get-campaigns/:id").get(user.getCampaigns);
module.exports = router;
