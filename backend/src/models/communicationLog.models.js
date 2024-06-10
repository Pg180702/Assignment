const mongoose = require("mongoose");
const communicationLogSchema = new mongoose.Schema(
  {
    audienceId: {
      type: mongoose.Types.ObjectId,
      ref: "Customer",
    },
    campaignId: {
      type: mongoose.Types.ObjectId,
      ref: "Campaign",
    },
    campaignMessage: {
      type: String,
      required: true,
    },
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["SENT", "FAILED", "PENDING"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);
const CommunicationLog = mongoose.model(
  "CommunicationLog",
  communicationLogSchema
);
module.exports = CommunicationLog;
