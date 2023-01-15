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

// indexing "StudyMaterial" at schema level 
// (compound indexing) so if text search matches l
// any of the fields, it wil return them
StudyMaterial.index({
   name: "text",
   course: "text",
   prof: "text",
})

module.exports = mongoose.model("StudyMaterial", StudyMaterial);
