const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM swimmers WHERE age_group = '10 and under'",
  [],
  (err, result) => {
    res.render("statviewer", { swimmers: result.rows });
  });
});

router.post("/", (req, res) => {
  switch(req.body.id) {
    case 1:
      db.query("SELECT * FROM swimmers WHERE age_group = $1",
      [req.body.group],
      (err, result) => {
        if (err) {
          return err;
        }
        res.send(result.rows);
      });
      break;
    case 2:
      db.query("SELECT * FROM swimmers WHERE id = $1",
      [req.body.swimmer[1]],
      (err, result) => {
        if (err) {
          return err;
        }
        res.send(result.rows[0]);
      });
      break;
  }
});

module.exports = router;
