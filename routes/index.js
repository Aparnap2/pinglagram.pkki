


var express = require("express");

var router = express.Router();
const userModel = require("./users.js");
const postModel = require ("./post.js")
const passport = require("passport");

const localstrategy = require("passport-local");
const upload = require("./multer.js");
const mongoose = require('mongoose');

const { cloudinary } = require('./multer');

// ... other configurations and middleware






passport.use(new localstrategy(userModel.authenticate()));
router.get("/", function (req, res) {
  res.render("index", { footer: false });
});

router.get("/login", function (req, res) {
  res.render("login.ejs", { footer: false });
});

router.get("/feed", isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({username: req.session.passport.user});
 const posts= await postModel.find().populate("user");
  res.render("feed", { footer: true, posts,cloudinary , user });
});

router.get("/profile", isLoggedIn, async function (req, res) {


  const user = await userModel.findOne({username: req.session.passport.user}).populate("posts")
  res.render("profile.ejs", { footer: true, user, cloudinary })
});

router.get("/search", isLoggedIn, function (req, res) {
  res.render("search", { footer: true , cloudinary});
});

router.get("/like/post/:id", isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({username: req.session.passport.user})
  const post = await postModel.findOne({_id: req.params.id});
  if(post.likes.indexOf(user._id) === -1 )
  post.likes.push(user._id);
else {
  post.likes.splice(post.likes.indexOf(user._id),1);

}
await post.save();
res.redirect("/feed");
  
});
router.get("/username/:username", isLoggedIn,  async function (req, res) { 

  const regex = new RegExp (`^${req.params.username}`, 'i');
const users = await userModel.find({username:regex});

res.json(users)
 
});

router.get("/edit", isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({username: req.session.passport.user})
  res.render("edit", { footer: true , user});
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

router.post("/upload", isLoggedIn, upload.single("image"), async function (req, res){
  const user = await userModel.findOne({username: req.session.passport.user})
const post = 
await postModel.create({
  picture: req.file.filename,
  user:user._id,
  caption : req.body.caption
})

user.posts.push(post._id)
await user.save();

  res.redirect("/feed");
}),

router.post("/update", upload.single("image"), async function (req, res) {
  const user= await userModel.findOneAndUpdate(
    { username: req.session.passport.user},
    {username:req.body.username,
    name : req.body.name,
  bio:req.body.bio },{new : true}
  );

 if (req.file) {
  user.profileImage = req.file.filename;
 }
  await user.save();
  res.redirect("/profile");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}
module.exports = router;
