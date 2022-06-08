const express = require("express");
const router = express.Router();
const db = require("../db");
const ejs = require("ejs");
const format = require("pg-format");

function getAgeGroup(age) {
  if (age <= 10) {
    return "10 and under";
  } else if (age <= 12) {
    return "11 - 12 years";
  } else if (age <= 14) {
    return "13 - 14 years";
  } else {
    return "15 and over"
  }
}

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

router.delete("/del", (req, res) => {
  db.query("DELETE FROM swimmers WHERE id = $1",
  [req.body.id],
  (err, result) => {
    if (err) {
      return err;
    }
    res.send({ });
  });
});

router.post("/edit", (req, res) => {
  // TODO: validation
  var age_group = getAgeGroup(req.body.age);

  db.query("UPDATE swimmers SET name = $1, gender = $2, age = $3, age_group = $4 WHERE id = $5",
  [req.body.name, req.body.gender, req.body.age, age_group, req.body.id],
  (err, result) => {
    if (err) {
      return err;
    }
    res.send({ });
  });
});

router.get("/add", (req, res) => {
  res.render("add");
});

router.post("/add", (req, res) => {
  db.query("INSERT INTO swimmers (name, gender, age, age_group) VALUES ($1, $2, $3, $4)",
  [req.body.name, req.body.gender, req.body.age, getAgeGroup(req.body.age)],
  (err, result) => {
    if (err) {
      return err;
    }
    res.send({ });
  });
});

module.exports = router;
