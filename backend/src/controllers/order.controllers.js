const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/order.models");
const ApiError = require("../utils/ApiError");
const Customer = require("../models/customer.models");
const { publish } = require("../utils/pubsub");
const newOrder = async (req, res) => {
  try {
    const { customer, itemName, subTotal, tax, shippingCharges } = req.body;
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    const finalTotal = subTotal + tax + shippingCharges;
    const customerExist = await Customer.findById(customer);
    if (!customerExist)
      throw new ApiError(400, "Cant place order as no such customer");
    customerExist.noOfVisits = customerExist.noOfVisits + 1;
    await customerExist.save();
    await publish("customer_creation", {
      type: "order",
      data: {
        customer,
        itemName,
        subTotal,
        tax,
        shippingCharges,
        total: finalTotal,
        orderDate: formattedDate,
      },
    });

    return res.status(200).json("Order created successfully");
  } catch (error) {
    return res.status(400).json(new ApiError(400, error));
  }
};

module.exports = { newOrder };
