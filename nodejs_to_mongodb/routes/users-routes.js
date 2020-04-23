const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/user-controllers");
const { check } = require("express-validator");
const fileUpload = require("../middleware/file-upload");

router.get("/", usersControllers.getuserslist);

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersControllers.createuser
);

router.post("/login", usersControllers.loginuser);

module.exports = router;

//image is key or id that we expects from users
