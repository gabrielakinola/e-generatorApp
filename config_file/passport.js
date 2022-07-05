const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//Load User Model

const User = require("../models/Userdb");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      //Match User
      User.findOne({ email: email })
        .then((usern) => {
          if (!usern) {
            return done(null, false, {
              message: "That email is not registered",
            });
          }
          // Match Password
          bcrypt.compare(password, usern.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              return done(null, usern);
            } else {
              return done(null, false, { message: "Password incorrect" });
            }
          });
        })
        .catch((err) => console.log(err));
    })
  );

  passport.serializeUser((usern, done) => {
    done(null, usern.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, usern) => {
      done(err, usern);
    });
  });
};
