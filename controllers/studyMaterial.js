const EduSupply = require("../models/StudyMaterial");

async function getStudyMaterials(req, res) {
   const studyMaterials = await EduSupply.find();
   return res.json({ result: studyMaterials });
}

module.exports = { getStudyMaterials };
