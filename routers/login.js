const router = require("express").Router();
const { handleAuthentication } = require("../controllers/login");

router.post("/api/auth", handleAuthentication);

module.exports = router;
