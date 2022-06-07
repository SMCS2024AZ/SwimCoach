const express = require("express");
const router = express.Router();
const db = require("../db");
const ejs = require("ejs");
const format = require("pg-format");

router.get("/", (req, res) => {
  db.query("SELECT * FROM swimmers",
  [],
  (err, result) => {
    if (err) {
      return err;
    }
    res.render("teamlist", { swimmers: result.rows });
  });
});

router.get("/group", (req, res) => {
  var group = (req.query.group == "all age groups") ? ["10 and under", "11 - 12 years",
  "13 - 14 years", "15 and over"] : [req.query.group];
  var gender = (req.query.gender == "all genders") ? ["male", "female"] : [req.query.gender];
  var queryString = format("SELECT * FROM swimmers WHERE (age_group IN (%L) AND gender IN (%L))", group, gender);
  db.query(queryString,
  [],
  (err, result) => {
    if (err) {
      return err;
    }
    res.send(result.rows);
  });
});

router.get("/search", (req, res) => {
  var searchTerm = "%" + req.query.term + "%";
  db.query("SELECT * FROM swimmers WHERE LOWER(name) like LOWER($1)",
  [searchTerm],
  (err, result) => {
    if (err) {
      return err;
    }
    res.send(result.rows);
  });
});

module.exports = router;
