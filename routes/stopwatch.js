const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {
  // TODO: add id to user when sending data
  console.log(req.body);
});

module.exports = router;
