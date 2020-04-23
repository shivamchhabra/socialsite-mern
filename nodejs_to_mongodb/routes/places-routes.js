const express = require("express");
const fileUpload = require("../middleware/file-upload");
const router = express.Router();
const httperror = require("../models/httperror");
const placescontroller = require("../controllers/places-controllers");
const checkAuth = require("..//middleware/check-auth");

router.get("/:pid", placescontroller.getplacebyid);

router.get("/getplacebyuserid/:userid", placescontroller.getplacebyUserId);

router.use(checkAuth);
//after this everyroute can be reached if token is valid

router.post("/", fileUpload.single("image"), placescontroller.createplace);

router.patch("/:pid", placescontroller.updateplaces);

router.delete("/:pid", placescontroller.deleteplace);

module.exports = router;
