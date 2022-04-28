var express = require("express");
var router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const isLoggedIn = require("../middleware/isLoggedIn");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

//GET Sign Up route.
router.get("/signup", (req, res, next) => {
  res.render("signup");
});

//POST Sign Up route.
router.post("/signup", (req, res, next) => {
  //1. Make sure all fields are filled out.
  if (
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.email ||
    !req.body.password
  ) {
    res.render("signup", { message: "Please fill out all fields." });
  }

  //2. Check if email already exists.
  User.findOne({ email: req.body.email }).then((foundEmail) => {
    if (foundEmail) {
      res.render("signup", { message: "Email already exists" });
    } else {
      //3. Hash Password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);

      //4. Create User
      User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        city: req.body.city,
        state: req.body.state,
        email: req.body.email,
        password: hashedPassword,
      })
        .then((newUser) => {
          req.session.user = newUser;
          res.render("index", { message: `Welcome, ${newUser.firstName}!` });
        })
        .catch((error) => {
          console.log("Error while creating user", error.message);
          res.render("signup", { message: "Failed to create user." });
        });
    }
  });
});

//GET Log In Route
router.get("/login", (req, res, next) => {
  res.render("login");
});

//POST Log In Route
router.post("/login", (req, res, next) => {
  //1. Check fields are filled out
  if (!req.body.email || !req.body.password) {
    res.render("login", { message: "Please fill out all fields." });
  }

  //2.Make sure User exists.
  User.findOne({ email: req.body.email })
    .then((foundUser) => {
      if (foundUser) {
        //3. Check password
        const doesMatch = bcrypt.compareSync(
          req.body.password,
          foundUser.password
        );

        if (doesMatch) {
          //4. Set up a session
          req.session.user = foundUser;
          res.render("index", {
            message: `Welcome back, ${foundUser.firstName}!`,
          });
        } else {
          res.render("login", { message: "Log in attempt failed. Please try again." });
        }
      }
    })
    .catch((err) => {
      res.render("login", { message: "Email does not exist" });
    });
});

//GET logout user.
router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.render("index", {message: "See you soon!"});
});

//GET Update Users Account
router.get("/update", isLoggedIn, (req, res, next) => {
  User.findById(req.session.user)
    .then((foundUserId) => {
      res.render("updateUser", { foundUserId: foundUserId });
    })
    .catch((err) => {
      res.redirect("/");
    });
});

//POST Update Users Account
router.post("/update", isLoggedIn, (req, res, next) => {
  User.findByIdAndUpdate(req.session.user._id, {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    dateOfBirth: req.body.dateOfBirth,
    city: req.body.city,
    state: req.body.state,
    email: req.body.email,
  })
    .then((updatedUser) => {
      res.render("index", {message: "Your account was successfully updated!"});
    })
    .catch((error) => {
      console.log("Failed to update account information.", error.message);
    });
});

//GET Delete user.
router.get("/delete", (req, res, next) => {
  User.findByIdAndDelete(req.session.user._id)
    .then(() => {
      res.render("index", {message: "Your account has been successfully deleted."})
    })
    .catch((err) => {
      console.log("Failed", err.message)
    })
});

module.exports = router;
