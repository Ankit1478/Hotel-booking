const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js")
const userController = require("../controllers/user.js");

router.get("/signup", userController.signupForm);

router.post(
  "/signup",
  wrapAsync(userController.signupUser)
);

router.get("/login", userController.loginForm);

router.post(
  "/login",saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

router.get("/logout",userController.logOut)

module.exports = router;
