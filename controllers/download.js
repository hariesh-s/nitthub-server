const StudyMaterial = require("../models/StudyMaterial");

async function handleDownload(req, res) {
   console.log(req.params);
   if (!req.params)
      return res
         .status(400)
         .json({ message: "Need material ID for download!" });

   const { materialID } = req.params;
   console.log(materialID);
   if (!materialID)
      return res
         .status(400)
         .json({ message: "Need material ID for download!" });

   const foundMaterial = await StudyMaterial.findOne({ _id: materialID });
   console.log(foundMaterial);
   if (!foundMaterial)
      return res.status(404).json({ message: "Material not found!" });

   // logic for downloading material

   res.status(200).json({ message: "Material sent successfully!" });
}

module.exports = { handleDownload };
