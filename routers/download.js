const router = require("express").Router();
const { handleDownload, getUserDownloads } = require("../controllers/download");
const isAuthorized = require("../middlewares/authorize");

router.use(isAuthorized)
router.get("/", getUserDownloads)
router.get("/:materialID", handleDownload);

module.exports = router;
