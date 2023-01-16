const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
   username: {
      type: String,
      required: true,
   },
   password: {
      type: String,
      required: true,
   },
   refreshToken: {
      type: String,
   },
   uploads: {
      type: Array,
      default: [Schema.Types.ObjectId],
      ref: "StudyMaterial",
   },
   downloads: {
      type: Array,
      default: [],
   }
});

module.exports = mongoose.model("User", userSchema);
