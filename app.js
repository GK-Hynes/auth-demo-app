const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const User = require("./models/user");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const expressSession = require("express-session");

mongoose.connect("mongodb://localhost/auth_demo", { useMongoClient: true });
mongoose.Promise = global.Promise;

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  expressSession({
    secret: "Gaeilge abú",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ===============
// ROUTES
// ===============

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/secret", isLoggedIn, (req, res) => {
  res.render("secret");
});

// AUTH ROUTES

// Show sign up form
app.get("/register", (req, res) => {
  res.render("register");
});

// Handle user sign up
app.post("/register", (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        return res.render("register");
      }
      passport.authenticate("local")(req, res, () => {
        res.redirect("/secret");
      });
    }
  );
});

// LOGIN ROUTES
// Render login form
app.get("/login", (req, res) => {
  res.render("login");
});

// Login logic
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
  }),
  (req, res) => {}
);

// LOGOUT ROUTE
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.listen(3000, () => {
  console.log("The server has started.......");
});
