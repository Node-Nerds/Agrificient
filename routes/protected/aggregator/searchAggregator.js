const Aggregator = require("../../../db/models/aggregator");
const router = require("express").Router();

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("aggregator/searchaggregator.ejs");
  } else {
    res.sendStatus(401);
  }
});

router.post("/", (req, res) => {
  if (req.isAuthenticated()) {
    const aggregator = new Aggregator();

    if (req.body.pincode != null) {
      aggregator.findByPincode(req.body.pincode, (err, aggregators) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          res.send(aggregators);
        }
      });
    } else {
      aggregator.findByPos(
        req.body.latitude,
        req.body.longitude,
        (err, aggregators) => {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else {
            res.send(aggregators);
          }
        }
      );
    }
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
