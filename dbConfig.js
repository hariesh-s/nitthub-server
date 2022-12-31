const mongoose = require("mongoose");

async function connectDB() {
   try {
      await mongoose.connect(process.env.DB_URI, {
         useUnifiedTopology: true,
         useNewUrlParser: true,
      });
   } catch (err) {
      console.log(err);
   }
}

module.exports = connectDB;
