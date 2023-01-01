const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EduSupplySchema = new Schema({
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
});

module.exports = mongoose.model("EduSupply", EduSupplySchema);
