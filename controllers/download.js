const path = require("path")

const StudyMaterial = require("../models/StudyMaterial");

async function handleDownload(req, res) {
   // authorize middleware adds user to req
   const user = req.user;
   if (!user) return res.status(401).json({ message: "Not authorized!" });

   if (!req.params)
      return res
         .status(400)
         .json({ message: "Need material ID for download!" });

   const { materialID } = req.params;
   if (!materialID)
      return res
         .status(400)
         .json({ message: "Need material ID for download!" });

   const foundMaterial = await StudyMaterial.findOne({ _id: materialID });
   if (!foundMaterial)
      return res.status(404).json({ message: "Material not found!" });

   // saving the material ID to user downloads
   user.downloads.push(materialID)
   await user.save()
   
   res.status(200).sendFile(path.join(__dirname, foundMaterial.link))
}

function getUserDownloads(req, res) {
   // authorize middleware adds user to req
   const user = req.user;
   if (!user) return res.status(401).json({ message: "Not authorized!" });

   res.status(200).json({ result: user.downloads })
}

module.exports = { handleDownload, getUserDownloads };
