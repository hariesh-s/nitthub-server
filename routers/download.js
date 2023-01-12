const router = require("express").Router();
const { handleDownload, getUserDownloads } = require("../controllers/download");
const isAuthorized = require("../middlewares/authorize");

router.get("/", getUserDownloads)
router.get("/:materialID", isAuthorized, handleDownload);

module.exports = router;
