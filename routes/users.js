const express = require("express");
const User = require("../models/Userdb");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { ensureAuthenticated } = require("../config_file/auth");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("loginpage");
});

router.get("/register", (req, res) => {
  res.render("reg");
});
router.get("/ticketmaster", ensureAuthenticated, (req, res) => {
  res.render("tm");
});
router.get("/ticketmaster/tickets", ensureAuthenticated, (req, res) => {
  res.render("tmtix");
});

router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;

  let usererrors = [];

  if (!name || !email || !password || !password2) {
    usererrors.push({ msg: "Please fill in all required fields" });
  }
  var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

  if (!password.match(passw)) {
    usererrors.push({
      msg: "Password must be at least 6-20 characters and must contain one numeric digit, one uppercase and one lowercase letter ",
    });
  }

  if (password !== password2) {
    usererrors.push({ msg: "Passwords do not match" });
  }

  if (usererrors.length > 0) {
    res.render("reg", {
      usererrors,
      name,
      email,
    });
  } else {
    User.findOne({ email: email }).then((usern) => {
      if (usern) {
        usererrors.push({ msg: "Email is already registered" });
        res.render("reg", {
          usererrors,
        });
      } else {
        const newuser = new User({
          name,
          email,
          password,
        });
        //Hash password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newuser.password, salt, (err, hash) => {
            if (err) throw err;

            newuser.password = hash;
            newuser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can login"
                );
                res.redirect("/user/login");
              })
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
});

// Login Handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/user/login",
    failureFlash: true,
  })(req, res, next);
});

// Logout Handle
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
