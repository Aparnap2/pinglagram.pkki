var express = require("express");

var router = express.Router();
const userModel = require("./users.js");

const passport = require("passport");

const localstrategy = require("passport-local");
const upload = require("./multer.js");

passport.use(new localstrategy(userModel.authenticate()));
router.get("/", function (req, res) {
  res.render("index", { footer: false });
});

router.get("/login", function (req, res) {
  res.render("login.ejs", { footer: false });
});

router.get("/feed", isLoggedIn, function (req, res) {
  res.render("feed", { footer: true });
});

router.get("/profile", isLoggedIn, function (req, res) {
  res.render("profile.ejs", { footer: true });
});

router.get("/search", isLoggedIn, function (req, res) {
  res.render("search", { footer: true });
});

router.get("/edit", isLoggedIn, function (req, res) {
  res.render("edit", { footer: true });
});

router.get("/upload", isLoggedIn, function (req, res) {
  res.render("upload", { footer: true });
});

/////////////////////////////////////////////

router.post("/register", async function (req, res, next) {
  try {
    const userData = await new userModel({
      username: req.body.username,
      name: req.body.name,
      email: req.body.email, // Corrected typo
    });

    userModel.register(userData, req.body.password, (error) => {
      if (error) {
        next(error); // Pass errors to error handler middleware
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/profile");
        });
      }
    });
  } catch (error) {
    next(error); // Catch any errors within the try block
  }
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  }),
  function (req, res) {
    // Successful authentication logic
    req.session.User= req.User; // Set session variable
    res.redirect("/profile"); // Redirect to profile
  }
);

router.get("/logout", function (req, res, next) {
  req.logout(function (error) {
    if (error) {
      return next(error);
    }

    res.redirect("/");
  });
});

router.post("/update", upload.single("image"), async function (req, res) {
  const User= await userModel.findOneAndUpdate(
    { username: req.session.passport.user},
    {username:req.body.username,
    name : req.body.name,
  bio:req.body.bio },{new : true}
  );

  User.profileImage = req.file.filename;
  await User.save();
  res.redirect("/profile");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}
module.exports = router;
