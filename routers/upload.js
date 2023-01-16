const router = require("express").Router();
const {
   handleUpload,
   getUserUploads,
   deleteUpload,
} = require("../controllers/upload");
const isAuthorized = require("../middlewares/authorize");

router.use(isAuthorized);
router.get("/", getUserUploads);
router.post("/", handleUpload);
router.delete("/:materialID", deleteUpload);

module.exports = router;
