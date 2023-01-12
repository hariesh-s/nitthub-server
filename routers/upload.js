const router = require("express").Router();
const { handleUpload, getUserUploads } = require("../controllers/upload");
const isAuthorized = require("../middlewares/authorize");

router.get("/", getUserUploads)
router.post("/", isAuthorized, handleUpload);

module.exports = router;
