const express = require("express");
const router = express.Router();

const user = require("../controllers/user.controllers");

router.route("/oauth").get(user.googleOauthHandler);
module.exports = router;
