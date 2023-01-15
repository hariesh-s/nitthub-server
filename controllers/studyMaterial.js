const EduSupply = require("../models/StudyMaterial");

async function getStudyMaterials(req, res) {
   // need atleast one of them
   const { query, course, prof } = req.body;
   console.log(query, course, prof);
   if (!query && !course && !prof)
      return res
         .status(400)
         .json({ message: "Need atleast one parameter for search!" });

   const studyMaterials = await EduSupply.find({
      // an optimized way to search as all these fields 
      // are specially indexed for text search
      $text: { $search: query + " " + course + " " + prof },
   }).sort({ score: { $meta: "textScore" } });

   return res.json({ result: studyMaterials });
}

module.exports = { getStudyMaterials };
