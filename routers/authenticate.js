const router = require("express").Router();
const {
   handleAuthentication,
   handleLogout,
   isUserLoggedIn,
   renewToken,
} = require("../controllers/authenticate");

// router.get("/", isUserLoggedIn);
router.post("/", handleAuthentication);
// router.delete("/", handleLogout);

router.get("/refresh", renewToken)

module.exports = router;
