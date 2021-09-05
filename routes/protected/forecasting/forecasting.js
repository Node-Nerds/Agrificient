let { PythonShell } = require("python-shell");
const router = require("express").Router();
const path = require("path");
const axios = require("axios");

router.get("/", (req, res) => {
  res.render("forecasting/forecasting.ejs");
});

router.post("/", (req, res) => {
  // var options = {
  //   mode: "text",
  //   pythonPath: "python",
  //   pythonOptions: ["-u"],
  //   scriptPath: "PyScript",
  //   args: [
  //     "--year=" + req.body.year,
  //     "--season=" + req.body.season,
  //     "--district=" + req.body.district,
  //     "--crop=" + req.body.crop,
  //   ],
  // };
  // PythonShell.run("predict.py", options, function (err, results) {
  //   if (err) throw err;
  //   // results is an array consisting of messages collected during execution
  //   res.send(results);
  // });

  var fetchLink =
    "https://forecast-11.herokuapp.com/hello/" +
    req.body.year +
    "/" +
    req.body.season +
    "/" +
    req.body.district +
    "/" +
    req.body.crop;

  axios
    .get(fetchLink)
    .then((response) => {
      console.log(response.data.output);
      return res.json(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
