const router = require("express").Router();
const {
   handleAuthentication,
   isUserLoggedIn,
   handleLogout,
} = require("../controllers/authenticate");
const isAuthorized = require("../middlewares/authorize");

router.get("/", isAuthorized, isUserLoggedIn);
router.post("/", handleAuthentication);
router.delete("/", handleLogout);

module.exports = router;
