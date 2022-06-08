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

module.exports = router;
