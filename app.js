const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const fs = require("fs");

const app = express();

require("./config_file/passport")(passport);

//Db config
const database = require("./config_file/keys.js").MongoURI;

//Connect to Mongo
mongoose
  .connect(database, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

//set view engine
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("layout", "layouts");

port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "static")));

//Body-Parser
app.use(express.urlencoded({ extended: false }));

//Express-session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash middleware
app.use(flash());

//Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", require("./routes/index"));
app.use("/user", require("./routes/users"));

app.listen(port, () => {
  console.log(`Server running on port ${port} `);
});
