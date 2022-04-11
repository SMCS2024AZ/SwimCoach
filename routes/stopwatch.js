const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM swimmers WHERE age_group = '10 and under'",
  [],
  (err, result) => {
    res.render("setup", { swimmers : result.rows });
  });
});

router.post("/", (req, res) => {
  db.query("SELECT * FROM swimmers WHERE age_group = $1",
  [req.body.group],
  (err, result) => {
    res.send(result.rows);
  });
});

module.exports = router;
