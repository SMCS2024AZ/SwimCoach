const express = require("express");
const router = express.Router();
const db = require("../db");
const ejs = require("ejs");
const format = require("pg-format");

router.get("/", (req, res) => {
  db.query("SELECT * FROM swimmers WHERE age_group = '10 and under'",
  [],
  (err, result) => {
    if (err) {
      return err;
    }
    res.render("setup", { swimmers : result.rows });
  });
});

router.post("/", (req, res) => {
  db.query("SELECT * FROM swimmers WHERE age_group = $1",
  [req.body.group],
  (err, result) => {
    if (err) {
      return err;
    }
    res.send(result.rows);
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
  for (const result of req.body.results) {
    queryString = format("UPDATE swimmers SET %I = %I || '{%s}' WHERE id = %s\n",
    req.body.race, req.body.race, result.time, result.id);
    db.query(queryString,
    [],
    (err, result) => {
      if (err) {
        return err;
      }
    });
    return res.send({ });
  }
});

module.exports = router;
