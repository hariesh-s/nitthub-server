const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");
const { randomFillSync } = require("crypto");

const eventEmitter = new EventEmitter();
const StudyMaterial = require("../models/StudyMaterial");
const User = require("../models/User");

// used while creating paths to store
// files for security reasons
const random = (() => {
   const buf = Buffer.alloc(16);
   return () => randomFillSync(buf).toString("hex");
})();

async function handleUpload(req, res) {
   // authorize middleware adds user to req
   const userID = req.userID;
   if (!userID) return res.status(401).json({ message: "Not authorized!" });

   // fetching only neccessary details
   // from user document using user id
   const user = await User.findOne(
      { _id: userID },
      { _id: false, username: true, uploads: true }
   );

   // busboy middleware adds busboy to req
   if (!req.busboy)
      return res
         .status(400)
         .json({ message: "Need material details for upload!" });

   // declaring all variables we need
   let [materialName, course, prof, materialPath, mimeType] = [
      "",
      "",
      "",
      "",
      "",
   ];
   let ERROR = false;

   // busboy reads form data in the order of input elements in frontend.
   // In our case all fields (eg: materialName, course, prof) appear
   // first and then the input element for file. So we "emit" our custom
   // "launchFinalPhase" event after busboy invokes the "file" event handler.
   req.busboy.on("field", (name, value, info) => {
      console.log("in field ", name, " value ", value);
      switch (name) {
         case "materialName":
            console.log("in field ", name, " value ", value);
            materialName = value;
            break;
         case "course":
            console.log("in field ", name, " value ", value);
            course = value;
            break;
         case "prof":
            console.log("in field ", name, " value ", value);
            prof = value;
            break;
         default:
            ERROR = true;
      }
   });

   req.busboy.on("file", (name, file, info) => {
      console.log("in file ", name, " info ", info);
      switch (name) {
         case "material":
            materialPath = path.join(
               "..",
               "public",
               "materialsDB",
               `busboy-upload-${random()}-${info.filename}`
            );
            mimeType = info.mimeType;
            break;
         default:
            ERROR = true;
      }

      eventEmitter.emit("launchFinalPhase", file);
   });

   async function executeFinalPhase(file) {
      if (ERROR)
         return res
            .status(400)
            .json({ message: "Material details not labelled correctly!" });

      console.log("final phase ", materialName, course, prof);
      if (!materialName || !course || !prof)
         return res
            .status(400)
            .json({ message: "Material details incomplete!" });

      const materialExists = await StudyMaterial.findOne({
         name: materialName,
         prof,
         course,
      });

      if (materialExists)
         return res.status(409).json({ message: "Material already exists!" });

      try {
         file.pipe(fs.createWriteStream(path.join(__dirname, materialPath)));
         const studyMaterial = await StudyMaterial.create({
            name: materialName,
            owner: user.username,
            prof,
            course,
            link: materialPath,
            mimeType,
         });

         // adding material ID to uploads array in user document
         user.uploads.push(studyMaterial._id);
         await user.save();

         return res
            .status(200)
            .json({ message: "Successfully added study material!" });
      } catch (error) {
         return res.status(500).json({ message: "Internal server error!" });
      }
   }

   eventEmitter.on("launchFinalPhase", executeFinalPhase);

   // this is needed as per connect-busboy documentation
   req.pipe(req.busboy);

   // have to remove all listeners before closing the request else it will crash
   // the server on subsequent requests as all the listeners will be triggered
   req.on("close", () => {
      eventEmitter.removeListener("launchFinalPhase", executeFinalPhase);
   });
}

async function getUserUploads(req, res) {
   // authorize middleware adds user to req
   const userID = req.userID;
   if (!userID) return res.status(401).json({ message: "Not authorized!" });

   // fetching only neccessary details
   // from user document using user id
   const user = await User.findOne(
      { _id: userID },
      { _id: false, uploads: true }
   );
   
   res.status(200).json({ result: user.uploads });
}

async function deleteUpload(req, res) {
   // authorize middleware adds user to req
   const userID = req.userID;
   if (!userID) return res.status(401).json({ message: "Not authorized!" });

   const { materialID } = req.params;
   if (!materialID)
      return res
         .status(400)
         .json({ message: "Needed material ID for deletion!" });

   try {
      // deleting the study material first
      const deletedMaterial = await StudyMaterial.findOneAndDelete({
         _id: materialID,
      });

      // fetching only neccessary details
      const user = await User.findOne(
         { _id: userID },
         { _id: false, uploads: true }
      );

      // removing the study material id from
      // uploads array of user
      const deleteIndex = user.uploads.indexOf(deletedMaterial._id);
      if (deleteIndex >= 0 && deleteIndex < user.uploads.length) {
         user.uploads.splice(deleteIndex, 1);
         user.save();
      }

      res.status(200).json({ message: "Successfully deleted material!" });
   } catch (error) {
      res.status(404).json({ message: "Couldn't delete material! " + error });
   }
}

module.exports = { handleUpload, getUserUploads, deleteUpload };
