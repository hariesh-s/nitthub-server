const router = require("express").Router();
const { getStudyMaterials } = require("../controllers/studyMaterial");

router.post("/", getStudyMaterials);

module.exports = router;
