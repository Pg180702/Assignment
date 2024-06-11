const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Campaign = mongoose.model("Campaign", campaignSchema);
module.exports = Campaign;
