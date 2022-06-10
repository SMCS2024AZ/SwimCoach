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

function csvValidate(data) {
  var res = true;
  data.forEach(function(swimmer) {
    if (swimmer.name.length == 0 ||
      !["Male", "Female", "Other"].includes(swimmer.gender) ||
      !Number.isInteger(swimmer.age)) {
      res = false;
    }
  });
  return res;
}

function compare(a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}

router.get("/", (req, res) => {
  db.query("SELECT * FROM swimmers",
  [],
  (err, result) => {
    if (err) {
      return err;
    }
    res.render("teamlist", { swimmers: result.rows.sort(compare) });
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
  var errors = [];

  if (req.body.name.length == 0) {
    valid = false;
    errors.push("Invalid name.");
  }

  if (!Number.isInteger(req.body.age)) {
    errors.push("Invalid age.");
  }

  if (errors.length == 0) {
    var age_group = getAgeGroup(req.body.age);
    db.query("UPDATE swimmers SET name = $1, gender = $2, age = $3, age_group = $4 WHERE id = $5",
    [req.body.name, req.body.gender, req.body.age, age_group, req.body.id],
    (err, result) => {
      if (err) {
        return err;
      }
      res.send({ });
    });
  } else {
    res.send( { errs: errors } )
  }
});

router.get("/add", (req, res) => {
  res.render("add");
});

router.post("/individualAdd", (req, res) => {
  var errors = [];

  if (req.body.name.length == 0) {
    valid = false;
    errors.push("Invalid name.");
  }

  if (!Number.isInteger(req.body.age)) {
    errors.push("Invalid age.");
  }

  if (errors.length == 0) {
    db.query("INSERT INTO swimmers (name, gender, age, age_group) VALUES ($1, $2, $3, $4)",
    [req.body.name, req.body.gender, req.body.age, getAgeGroup(req.body.age)],
    (err, result) => {
      if (err) {
        return err;
      }
      res.send({ });
    });
  } else {
    res.send({ errs: errors });
  }
});

router.post("/csvAdd", (req, res) => {
  if (csvValidate(req.body.swimmers)) {
    req.body.swimmers.forEach(function(swimmer) {
      db.query("INSERT INTO swimmers (name, gender, age, age_group) VALUES ($1, $2, $3, $4)",
      [swimmer.name, swimmer.gender, swimmer.age, getAgeGroup(swimmer.age)],
      (err, result) => {
        if (err) {
          return err;
        }
      });
    });
    res.send({ });
  } else {
    res.send({ errs: ["Invalid input"] });
  }
});

module.exports = router;
