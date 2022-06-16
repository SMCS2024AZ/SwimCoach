const express = require("express");
const router = express.Router();
const db = require("../db");
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
    res.render("statviewer", { swimmers: result.rows.sort(compare) });
  });
});

router.post("/", (req, res) => {
  switch(req.body.id) {
    case 1: // get list of swimmers of age group for dropdown
      db.query("SELECT * FROM swimmers WHERE age_group = $1",
      [req.body.group],
      (err, result) => {
        if (err) {
          return err;
        }
        res.send(result.rows.sort(compare));
      });
      break;
    case 2: // get specific swimmer from id
      db.query("SELECT * FROM swimmers WHERE id = $1",
      [req.body.swimmer[1]],
      (err, result) => {
        if (err) {
          return err;
        }
        res.send(result.rows[0]);
      });
      break;
    case 3: // delete stat
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
