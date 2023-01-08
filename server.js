require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const cookie_parser = require("cookie-parser");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
   session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: true,
      cookie: { maxAge: 1000 * 60 * 1 }, // 1 minute in milliseconds
      resave: false,
   })
);
app.use(cookie_parser());

const connectDB = require("./dbConfig");
connectDB();

// routes
app.use("/api/authenticate", require("./routers/authenticate"));
app.use("/api/register", require("./routers/register"));
app.use("/api/edu-supplies", require("./routers/edu-supplies"))

mongoose.connection.once("open", () => {
   console.log("database connected!");
   app.listen(5000, () => {
      console.log("server listening on port 5000!");
   });
});
