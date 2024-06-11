const express = require("express");
const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");
const qs = require("qs");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../models/user.models");
const Campaign = require("../models/campaigns.models");
const CommunicationLog = require("../models/communicationLog.models");
const Customer = require("../models/customer.models");
function createMongoDBQuery(reqBody) {
  const initialRule = reqBody.initialRule;
  const conditions = reqBody.conditions;
  const operatorMap = {
    ">": "$gt",
    "<": "$lt",
    "=": "$eq",
  };
  const isDateField = (attribute) => {
    const dateFields = ["lastVisited"];
    return dateFields.includes(attribute);
  };
  const parseValue = (attribute, value) => {
    if (isDateField(attribute)) {
      return new Date(value);
    } else {
      return parseFloat(value);
    }
  };
  const initialQuery = {
    [initialRule.attribute]: {
      [operatorMap[initialRule.operator]]: parseValue(
        initialRule.attribute,
        initialRule.value
      ),
    },
  };
  let query = [initialQuery];
  conditions.forEach((condition) => {
    const conditionQuery = {
      [condition.attribute]: {
        [operatorMap[condition.operator]]: parseValue(
          condition.attribute,
          condition.value
        ),
      },
    };
    if (condition.logic === "AND") {
      query = [{ $and: [query[0], conditionQuery] }];
    } else if (condition.logic === "OR") {
      query = [{ $or: [query[0], conditionQuery] }];
    }
  });
  const finalQuery = query[0] || {};
  return finalQuery;
}

function buildQuery(req) {
  const reqBody = req;
  const query = createMongoDBQuery(reqBody);
  const filterQuery = JSON.stringify(query, null, 2);
  console.log(filterQuery);
  return query;
}
const googleOauthHandler = async (req, res) => {
  const code = req.query.code;
  console.log(code);
  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
    grant_type: "authorization_code",
  };
  try {
    const response = await axios.post(
      "https://oauth2.googleapis.com/token",
      qs.stringify(values),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const { id_token, access_token } = response.data;
    // console.log({ id_token, access_token });
    const response2 = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );
    const googleUser = response2.data;
    console.log({ googleUser });
    const options = { httpOnly: true, secure: true };
    const existUser = await User.findOne({ email: googleUser.email });

    if (existUser) {
      const token = jwt.sign(
        { email: googleUser.email },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );
      return res
        .status(200)
        .redirect(
          `https://assignment-coral-phi.vercel.app/oauth/callback?token=${token}&userId=${existUser._id}`
        );
      // .cookie("token", token, options)
      // .json({
      //   email: googleUser.email,
      //   userId: existUser._id,
      //   token: token,
      // })
    }
    const token = jwt.sign(
      { email: googleUser.email },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );
    const newUser = await User.create({
      name: googleUser.name,
      email: googleUser.email,
    });

    //now u insert this user in your model
    //access token and refresh token we can send and then can set cookies have a res.redirect
    return res
      .status(200)
      .redirect(
        `https://assignment-coral-phi.vercel.app/oauth/callback?token=${token}&userId=${newUser._id}`
      );
    // .cookie("token", token, options)
    // .json({ email: googleUser.email, token: token, userId: newUser._id })
  } catch (error) {
    return res.status(400).json(new ApiError(400, error));
  }
};
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existUser = await User.findOne({ email: email });
    if (existUser) return res.status(400).json({ msg: "User already exists" });
    const user = await User.create({ name, email, password });
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    const options = { httpOnly: true, secure: true };
    return (
      res
        .status(200)
        // .cookie("token", token, options)
        .json({ email: user.email, userId: user._id, token: token })
    );
  } catch (error) {
    res.status(404).json(error);
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  const passOk = password === userDoc.password;
  if (passOk) {
    // logged in
    //return res.status(200).json(userDoc);
    const options = { httpOnly: true, secure: true };
    const token = jwt.sign(
      { email: userDoc.email },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );
    return (
      res
        .status(200)
        // .cookie("token", token, options)
        .json({ email: userDoc.email, userId: userDoc._id, token: token })
    );
  } else {
    res.status(400).json("wrong credentials");
  }
};
const audienceCheck = async (req, res) => {
  const { initialRule, conditions } = req.body;
  // console.log(req.body);
  const objectReq = { initialRule, conditions };
  const queryToSearch = buildQuery(objectReq);
  // console.log(queryToSearch);
  const audience = await Customer.find(queryToSearch).exec();
  if (!audience) throw new ApiError(400, "Problem in finding audience");
  if (audience.length === 0)
    return res.status(200).json({ message: "No audience for this criteria" });
  // console.log(audience);
  // console.log(audience.length);
  return res
    .status(200)
    .json({ message: "Audience found", size: audience.length });
};
//   console.log(req.body);
//   const queryToSearch = buildQuery(req);
//   console.log(queryToSearch);
//   const audience = await Customer.find(queryToSearch).exec();
//   if (!audience) throw new ApiError(400, "Problem in finding audience");
//   if (audience.length === 0)
//     return res.status(200).json({ message: "No audience for this criteria" });
//   console.log(audience);
//   await Promise.all(audience.map(async(a)=>{
//     await CommunicationLog.create({
//       audienceId:a._id,
//       campaignId
//     })
//   }))
//   return res
//     .status(200)
//     .json({ message: "Audience found", size: audience.length });
// };
const campaignMessage = async (req, res) => {
  // const { userId } = req.params;
  // console.log(req.body);
  const { message, userId, initialRule, conditions } = req.body;
  try {
    const campaign = await Campaign.create({
      content: message,
      owner: userId,
    });
    if (!campaign) throw new ApiError(400, "Issue in creating Campaign");
    const cid = campaign._id;
    // console.log(cid);
    // console.log(req.body);
    const objectReq = { initialRule, conditions };
    // console.log(objectReq);
    const queryToSearch = buildQuery(objectReq);
    // console.log(queryToSearch);
    const audience = await Customer.find(queryToSearch).exec();
    // console.log(audience);
    await Promise.all(
      audience.map((a) =>
        CommunicationLog.create({
          audienceId: a._id,
          campaignId: cid,
          campaignMessage: `Hi ${a.name}, there is ${message}`,
          senderId: userId,
        })
      )
    );
    const delivery = await fetch(
      `${process.env.BACKEND_URL}/api/v1/users/delivery`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, userId, cid }),
      }
    );
    console.log(delivery);
    if (!delivery.ok)
      throw new ApiError(400, "Issue in triggering delivery api");
    return res
      .status(200)
      .json({ message: "Campaign Created and delivery api triggered" });
  } catch (error) {
    return res.status(400).json(new ApiError(400, error));
  }
};
const deliveryReceiptApi = async (req, res) => {
  console.log("delivery hit");
  const { message, userId, cid } = req.body;
  try {
    const audience = await CommunicationLog.find({
      senderId: userId,
      campaignId: cid,
    });
    await Promise.all(
      audience.map(async (a) => {
        a.message = message;
        a.status = Math.random() < 0.9 ? "SENT" : "FAILED";
        await a.save();
      })
    );
    res
      .status(200)
      .json({ message: "Delivery process completed and statuses updated" });
  } catch (error) {
    return res.status(400).json(new ApiError(400, error));
  }
};
const getCampaigns = async (req, res) => {
  const { id } = req.params;
  const campaigns = await Campaign.find({ owner: id }).sort({ createdAt: -1 });
  console.log(campaigns);
  if (!campaigns)
    return res.status(400).json({ message: "No campaigns of said user" });
  return res.status(200).json({ data: campaigns });
};
const campaignStats = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  console.log("campaign hit");
  const data = await CommunicationLog.find({ campaignId: id });
  if (data.length === 0)
    return res.status(400).json({ message: "No such campaign" });
  let success = 0;
  let fail = 0;
  data.map((log) => {
    if (log.status === "SENT") success = success + 1;
    else if (log.status === "FAILED") fail = fail + 1;
  });
  console.log(success);

  return res.status(200).json({ success: success, fail: fail });
};
const healthCheck = async (req, res) => {
  res.status(200).json({ message: "server started" });
};
module.exports = {
  googleOauthHandler,
  register,
  login,
  audienceCheck,
  campaignMessage,
  deliveryReceiptApi,
  getCampaigns,
  campaignStats,
  healthCheck,
};
