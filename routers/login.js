const router = require("express").Router();
const {
   handleAuthentication,
   handleLogout,
   isUserLoggedIn,
} = require("../controllers/login");

router.get("/", isUserLoggedIn);
router.post("/", handleAuthentication);
router.delete("/", handleLogout);

module.exports = router;
