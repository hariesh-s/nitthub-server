const router = require("express").Router();
const { generateNewToken } = require("../controllers/refreshToken");

router.get("/", generateNewToken);

module.exports = router;
