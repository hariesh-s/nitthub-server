const path = require("path")

const StudyMaterial = require("../models/StudyMaterial");

async function handleDownload(req, res) {
   // authorize middleware adds user to req
   const userID = req.userID;
   if (!userID) return res.status(401).json({ message: "Not authorized!" });

   // fetching only neccessary details 
   // from user document using user id
   const user = await User.findOne({ _id: userID }, { _id: false, downloads: true })

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

   res.download(path.join(__dirname, foundMaterial.link))
}

async function getUserDownloads(req, res) {
   // authorize middleware adds user to req
   const userID = req.userID;
   if (!userID) return res.status(401).json({ message: "Not authorized!" });

   // fetching only neccessary details 
   // from user document using user id
   const user = await User.findOne({ _id: userID }, { _id: false, downloads: true })

   res.status(200).json({ result: user.downloads })
}

module.exports = { handleDownload, getUserDownloads };
