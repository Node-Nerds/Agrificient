require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
var ejs = require("ejs");

const routes = require("./routes/");
require("./db/conn.js");

// Configuring the express app
const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());

app.use(bodyParser.json());

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("warehouse/home.ejs");
});

//  Connect all our routes to our application
app.use("/", routes);

// Turn on that server!
app.listen(3000, () => {
  console.log("App listening on port 3000");
});
