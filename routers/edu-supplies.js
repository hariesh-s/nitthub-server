const router = require("express").Router();
const { fetchAllSupplies } = require("../controllers/edu-supplies");

router.get("/", fetchAllSupplies);

module.exports = router;
