const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const pgSession = require("connect-pg-simple")(sessions);
const dotenv = require("dotenv").config({ path: __dirname + "/.env" })
const sessionPool = require("pg").Pool

app.set("view engine", "ejs");

const pool = new sessionPool({
  connectionString: process.env.DATABASE_URL || process.env.LOCAL_DB,
  ssl: {
    rejectUnauthorized: false
  }
});
const sessionConfig = {
  store: new pgSession({
    pool: pool,
    createTableIfMissing: true
  }),
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
  }
}
app.use(sessions(sessionConfig));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const stopwatch = require("./routes/stopwatch");
app.use("/stopwatch", isAuthenticated, stopwatch);
const statviewer = require("./routes/statviewer");
app.use("/statviewer", isAuthenticated, statviewer);
const teammanager = require("./routes/teammanager");
app.use("/teammanager", isAuthenticated, teammanager);

function isAuthenticated(req, res, next) {
  if (req.session.userid) next();
  else res.redirect("/");
}

// temp for testing
const user = process.env.USERNAME;
const pass = process.env.PASSWORD;

app.get("/", (req, res) => {
  var session = req.session;
  if (session.userid) {
    res.render("index");
  } else {
    res.render("login", { status: req.session.message });
  }
});

app.post("/login", (req, res) => {
    if (req.body.user == user && req.body.pass == pass){
      var session = req.session;
      session.userid = req.body.user;
      req.session.message = "success";
    } else {
      req.session.message = "Invalid username or password.";
    }
    res.redirect("/");
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(port);
