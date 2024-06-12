const { PubSub } = require("@google-cloud/pubsub");
const projectId = "XenoApp";
const path = require("path");
const Customer = require("../models/customer.models");
const Order = require("../models/order.models");
const filePath = path.join(__dirname, "../xenoapp-425717-15c6ff1ec108.json");
const client = new PubSub({
  keyFilename: filePath,
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
    message.ack();
  };
  sub.on("message", messageHandler);
};

module.exports = { publish, listen };
