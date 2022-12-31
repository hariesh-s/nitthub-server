require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./dbConfig");
connectDB();

const express = require("express");
const app = express();

mongoose.connection.once("open", () => {
   console.log("database connected!");
   app.listen(5000, () => {
      console.log("server listening on port 5000!");
   });
});
