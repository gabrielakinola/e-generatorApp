const express = require("express");
const { ensureAuthenticated } = require("../config_file/auth");

const router = express.Router();

//router.get("/", (req, res) => res.render("main"));
router.get("/", (req, res) => res.render("welcome"));

router.get("/dashboard", ensureAuthenticated, (req, res) => res.render("main"));

module.exports = router;
