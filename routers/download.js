const router = require("express").Router();
const { handleDownload } = require("../controllers/download");
const isAuthorized = require("../middlewares/authorize");

router.get("/:materialID", isAuthorized, handleDownload);

module.exports = router;
