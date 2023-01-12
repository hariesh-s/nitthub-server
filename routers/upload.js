const router = require("express").Router();
const { handleUpload, getUserUploads } = require("../controllers/upload");
const isAuthorized = require("../middlewares/authorize");

router.use(isAuthorized)
router.get("/", getUserUploads)
router.post("/", handleUpload);

module.exports = router;
