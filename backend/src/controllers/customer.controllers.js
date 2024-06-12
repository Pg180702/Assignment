const express = require("express");
const mongoose = require("mongoose");
const Customer = require("../models/customer.models");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcrypt");
const { publish } = require("../utils/pubsub");
const newCustomer = async (req, res) => {
  const { name, email, password, phoneNumber, total_spent } = req.body;
  try {
    if (!email || !password || !name || !phoneNumber)
      throw new ApiError(400, "All Fields Required");
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    const visit = 1;
    const hashedPassword = await bcrypt.hash(password, 10);
    await publish("customer_creation", {
      type: "customer",
      data: {
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        total_spent,
        noOfVisits: visit,
        lastVisited: formattedDate,
      },
    });
    return res
      .status(200)
      .json({ success: true, message: "Customer created successfully" });
  } catch (error) {
    return res.status(400).json(new ApiError(400, error));
  }
};
const newVisit = async (req, res) => {
  const { email, password } = req.body;
  //this just updates last visited
  const customer = await Customer.findOne({ email: email });
  if (!customer) throw new ApiError(400, "All Fields Required");
  const passwordCheck = await bcrypt.compare(password, customer.password);
  if (!passwordCheck) throw new ApiError(400, "Wrong credentials");
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  customer.lastVisited = formattedDate;
  customer.noOfVisits = customer.noOfVisits + 1;
  await customer.save();
  return express.response
    .status(200)
    .json({ success: true, message: "Updated lastVisited" });
};

module.exports = { newCustomer, newVisit };
