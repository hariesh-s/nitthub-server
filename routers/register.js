const router = require("express").Router();
const { handleRegistration } = require("../controllers/register");

router.post("/", handleRegistration);

module.exports = router;
