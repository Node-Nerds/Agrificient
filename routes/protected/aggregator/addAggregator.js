const Aggregator = require("../../../db/models/aggregator");
const router = require("express").Router();

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("aggregator/addaggregator.ejs");
  } else {
    res.sendStatus(401);
  }
});

router.post("/", (req, res) => {
  if (req.isAuthenticated()) {
    const aggregator = new Aggregator(
      req.body.name,
      req.user.id,
      req.body.phone,
      req.body.x,
      req.body.y,
      req.body.pincode,
      req.body.address,
      req.body.description,
      req.body.whatsapp
    );

    aggregator.save((err, done) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
