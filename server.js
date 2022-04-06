const express = require("express")
const app = express()

app.set("view engine", "ejs")

const stopwatch = require("./routes/stopwatch")
app.use("/stopwatch", stopwatch)

app.listen(8080)
