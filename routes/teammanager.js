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
  var age_group = "";
  if (req.body.age <= 10) {
    age_group = "10 and under";
  } else if (req.body.age <= 12) {
    age_group = "11 - 12 years";
  } else if (req.body.age <= 14) {
    age_group = "13 - 14 years";
  } else {
    age_group = "15 and over"
  }

  db.query("UPDATE swimmers SET name = $1, gender = $2, age = $3, age_group = $4 WHERE id = $5",
  [req.body.name, req.body.gender, req.body.age, age_group, req.body.id],
  (err, result) => {
    if (err) {
      return err;
    }
    res.send({ });
  });
});

module.exports = router;
