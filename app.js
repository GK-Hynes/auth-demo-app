const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const User = require("./models/user");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/auth_demo", { useMongoClient: true });

const app = express();
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/secret", (req, res) => {
  res.render("secret");
});

app.listen(3000, () => {
  console.log("The server has started.......");
});
