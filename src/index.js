const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const dotenv = require("dotenv").config();
const route = require("../src/route/route");

app = express();

app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_DB_LINK, { useNewUrlParser: true })
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT, () => {
  console.log(`Express app is running on ${process.env.PORT}`);
});
