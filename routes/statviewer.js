const express = require("express");
const router = express.Router();
const db = require("../db");
const format = require("pg-format");

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
    case 3:
      console.log(req.body)
      var queryString = "";
      if (req.body.index == 1) {
        queryString = format("UPDATE swimmers SET %I = %I[%s:] WHERE id = %s",
        req.body.race, req.body.race, req.body.index + 1, req.body.swimmerId);
      } else {
        queryString = format("UPDATE swimmers SET %I = array_cat(%I[1:%s], %I[%s:]) WHERE id = %s",
        req.body.race, req.body.race, req.body.index - 1, req.body.race, req.body.index + 1, req.body.swimmerId);
      }
      db.query(queryString,
      [],
      (err, result) => {
        if (err) {
          return err;
        }
        res.send({ });
      });
      break;
  }
});

module.exports = router;
