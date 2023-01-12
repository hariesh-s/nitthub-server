const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudyMaterial = new Schema({
   name: {
      type: String,
      required: true,
   },
   owner: {
      type: String,
      required: true,
   },
   course: {
      type: String,
      required: true,
   },
   prof: {
      type: String,
      required: true,
   },
   link: {
      type: String,
      required: true,
   },
   mimeType: {
      type: String,
   }
});

module.exports = mongoose.model("StudyMaterial", StudyMaterial);
