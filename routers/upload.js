const router = require("express").Router();
const { handleUpload } = require("../controllers/upload");
const isAuthorized = require("../middlewares/authorize");

router.post("/", isAuthorized, handleUpload);

module.exports = router;
