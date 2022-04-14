const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM swimmers WHERE age_group = '15 and over'",
  [],
  (err, result) => {
    res.render("statviewer", { swimmers: result.rows });
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

 module.exports = router;
