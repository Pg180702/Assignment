const { PubSub } = require("@google-cloud/pubsub");
const projectId = "XenoApp";
const path = require("path");
const fs = require("fs");
const Customer = require("../models/customer.models");
const Order = require("../models/order.models");
const tempFilePath = path.join("/tmp", "google-cloud-credentials.json");
fs.writeFileSync(tempFilePath, process.env.GOOGLE_CLOUD_CREDENTIALS, "utf8");

const client = new PubSub({
  keyFilename: tempFilePath,
});

const publish = async (topic, payload) => {
  let buffer = Buffer.from(JSON.stringify(payload));

  try {
    const mid = await client.topic(topic).publishMessage({ data: buffer });
    console.log(`Message ${mid} published`);
  } catch (error) {
    console.log(error.message);
  }
};
const listen = async () => {
  let sub = client.subscription("customer_subscription_pull");
  const messageHandler = async (message) => {
    const dataToInsert = JSON.parse(message.data);
    if (dataToInsert.type === "customer")
      await Customer.create(dataToInsert.data);
    else if (dataToInsert.type === "order")
      await Order.create(dataToInsert.data);
    else if (dataToInsert.type === "delivery") {
      const { message, userId, cid } = dataToInsert.data;
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
    }
    message.ack();
  };
  sub.on("message", messageHandler);
};

module.exports = { publish, listen };
