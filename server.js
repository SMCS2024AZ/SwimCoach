const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const stopwatch = require("./routes/stopwatch");
app.use("/stopwatch", stopwatch);
const statviewer = require("./routes/statviewer");
app.use("/statviewer", statviewer);
const teammanager = require("./routes/teammanager");
app.use("/teammanager", teammanager);

app.get("/", (req, res) => {
  res.render("index");
})

app.listen(port);
