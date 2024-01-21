var express = require("express");
var router = express.Router();
const userModel = require("./users.js");

const passport = require("passport");

const localstrategy = require("passport-local");

passport.use(new localstrategy(userModel.authenticate()));
router.get("/", function (req, res) {
  res.render("index", { footer: false });
});

router.get("/login", function (req, res) {
  res.render("login.ejs", { footer: false });
});

router.get("/feed", function (req, res) {
  res.render("feed", { footer: true });
});

router.get("/profile", function (req, res) {
  res.render("profile", { footer: true });
});

router.get("/search", function (req, res) {
  res.render("search", { footer: true });
});

router.get("/edit", function (req, res) {
  res.render("edit", { footer: true });
});

router.get("/upload", function (req, res) {
  res.render("upload", { footer: true });
});

/////////////////////////////////////////////

router.post("/register", async function (req, res, next) {
  try {
    const userData = new userModel({
      username: req.body.username,
      name: req.body.name,
      email: req.body.email, // Corrected typo
    });

    await userModel.register(userData, req.body.password);
    await passport.authenticate("local")(req, res, () => {
      res.redirect("/profile");
    });
  } catch (error) {
    next(error); // Pass errors to error handler middleware
  }
});

router.post(
  "/login",
  passport.authenticate(
    "local",
    {
      successRedirect: "/profile",
      failureRedirect: "/",
    },
    function (req, res) {}
  )
);

module.exports = router;
