const EduSupply = require("../models/Edu-supply");

async function fetchAllSupplies(req, res) {
   const supplies = await EduSupply.find();
   return res.json({ result: supplies });
}

module.exports = { fetchAllSupplies };
