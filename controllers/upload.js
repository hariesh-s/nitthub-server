const StudyMaterial = require("../models/StudyMaterial");

async function handleUpload(req, res) {
   // middleware adds user object to req
   console.log(req.user);
   const user = req.user;
   if (!user) return res.status(401).json({ message: "Not authorized!" });

   console.log(req.body);
   if (!req.body)
      return res
         .status(400)
         .json({ message: "Need material details for upload!" });

   const { materialName, course, prof } = req.body;
   console.log(materialName, course, prof);
   if (!materialName || !course || !prof)
      return res.status(400).json({ message: "Material details incomplete!" });

   const materialExists = await StudyMaterial.findOne({
      name: materialName,
      owner: user._id,
      prof,
      course,
   });
   console.log(materialExists);
   if (materialExists)
      return res.status(409).json({ message: "Material already exists!" });

   try {
      // extra upload logic later

      const studyMaterial = await StudyMaterial.create({
         name: materialName,
         owner: user._id,
         prof,
         course,
      });

      // adding material ID to uploads array in user
      user.uploads.push(studyMaterial._id);
      await user.save();

      return res
         .status(200)
         .json({ message: "Successfully added study material!" });
   } catch (error) {
      return res.status(500).json({ message: "Internal server error!" });
   }
}

module.exports = { handleUpload };
