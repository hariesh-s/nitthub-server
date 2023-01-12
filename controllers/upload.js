const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");
const { randomFillSync } = require("crypto");

const eventEmitter = new EventEmitter();
const StudyMaterial = require("../models/StudyMaterial");

// used while creating paths to store 
// files for security reasons
const random = (() => {
   const buf = Buffer.alloc(16);
   return () => randomFillSync(buf).toString("hex");
})();

function handleUpload(req, res) {
   // authorize middleware adds user to req
   const user = req.user;
   if (!user) return res.status(401).json({ message: "Not authorized!" });

   // busboy middleware adds busboy to req
   if (!req.busboy)
      return res
         .status(400)
         .json({ message: "Need material details for upload!" });

   // declaring all variables we need
   let [materialName, course, prof, materialPath, mimeType] = ["", "", "", "", ""];
   let ERROR = false;

   // busboy reads form data in the order of input elements in frontend.
   // In our case all fields (eg: materialName, course, prof) appear
   // first and then the input element for file. So we "emit" our custom
   // "launchFinalPhase" event after busboy invokes the "file" event handler.
   req.busboy.on("field", (name, value, info) => {
      console.log("in field ", name, " value ", value)
      switch (name) {
         case "materialName":
            console.log("in field ", name, " value ", value)
            materialName = value;
            break;
         case "course":
            console.log("in field ", name, " value ", value)
            course = value;
            break;
         case "prof":
            console.log("in field ", name, " value ", value)
            prof = value;
            break;
         default:
            ERROR = true;
      }
   });

   req.busboy.on("file", (name, file, info) => {
      console.log("in file ", name, " info ", info)
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

      console.log("final phase ", materialName, course, prof)
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

   req.pipe(req.busboy); // connect-busboy npm page says this is needed

   // have to remove all listeners before closing the request else it will crash 
   // the server on subsequent requests as all the listeners will be triggered
   req.on("close", () => {
      eventEmitter.removeListener("launchFinalPhase", executeFinalPhase);
   });
}

function getUserUploads(req, res) {
   // authorize middleware adds user to req
   const user = req.user;
   if (!user) return res.status(401).json({ message: "Not authorized!" });

   res.status(200).json({ result: user.uploads })
}

module.exports = { handleUpload, getUserUploads };
