const mongoose = require("mongoose");
const CustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      unique: [true, "Email already exists"],
      required: [true, "Please enter a valid email"],
      //   validate: validator.default.isEmail,
    },
    password: {
      type: String,
      required: [true, "Please enter a valid password"],
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    total_spent: {
      type: Number,
      required: true,
    },
    noOfVisits: {
      type: Number,
      required: true,
    },
    lastVisited: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
