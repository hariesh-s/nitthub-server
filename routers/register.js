const router = require("express").Router();
const { handleRegistration } = require("../controllers/register");

router.post("/api/registration", handleRegistration);

module.exports = router;
