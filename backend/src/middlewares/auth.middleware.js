const ApiError = require("../utils/ApiError.js");

const jwt = require("jsonwebtoken");
const User = require("../models/user.models.js");

const verifyJWT = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decodedToken?.email);

    if (!user) {
      return res.status(401).json({ message: "Invalid jwt token" });
    }

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
};
module.exports = { verifyJWT };
