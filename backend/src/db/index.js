const mongoose = require("mongoose");

const connectdb = () => {
  mongoose
    .connect(`${process.env.MONGODB_URI}`)
    .then(() => console.log("Mongo Connected!!"))
    .catch((err) => console.log(err));
};

module.exports = { connectdb };
