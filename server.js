const express = require("express")
const app = express
const port = process.env.PORT || 3000

app.set("view engine", "ejs")

const stopwatch = require("./routes/stopwatch")
app.use("/stopwatch", stopwatch)

app.listen(port)
