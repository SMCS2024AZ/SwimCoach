const express = require("express");
const router = express.Router();
const db = require("../db");
const ejs = require("ejs");
const format = require("pg-format");

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
  db.query("SELECT * FROM swimmers WHERE age_group = '10 and under'",
  [],
  (err, result) => {
    if (err) {
      return err;
    }
    res.render("setup", { swimmers : result.rows.sort(compare) });
  });
});

router.post("/", (req, res) => {
  db.query("SELECT * FROM swimmers WHERE age_group = $1",
  [req.body.group],
  (err, result) => {
    if (err) {
      return err;
    }
    res.send(result.rows.sort(compare));
  });
});

router.get("/run", (req, res) => {
  ejs.renderFile("views/run.ejs", req.query, (err, html) => {
    if (err) {
      return err;
    }
    res.send(html);
  });
});

router.post("/run", (req, res) => {
  // Generate query string
  var todayDate = new Date().toISOString();
  swimmerResults = req.body.results;
  swimmerResults.forEach((result) => {
    var queryString = format("UPDATE swimmers SET %I = %I || '{%s}' WHERE id = %s\n",
    req.body.race, req.body.race, result.time, result.id);
    db.query(queryString,
    [],
    (err, result) => {
      if (err) {
        return err;
      }
    });

    var timestampCol = req.body.race + "_timestamps";
    queryString = format("UPDATE swimmers SET %I = %I || '{%s}' WHERE id = %s\n",
    timestampCol, timestampCol, req.body.timestamp, result.id);
    db.query(queryString,
    [],
    (err, result) => {
      if (err) {
        return err;
      }
    });
  });
  return res.send({ });
});

module.exports = router;
