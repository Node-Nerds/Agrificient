const Warehouse = require("../../../db/models/warehouse");
const Proposal = require("../../../db/models/proposal");
const router = require("express").Router();

router.get("/:id", (req, res) => {
  if (req.isAuthenticated()) {
    var warehouse = new Warehouse();

    warehouse.findById(req.params.id, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.render("warehouse/customwarehouse.ejs", {
          id: data[0].id,
          warehouse_name: data[0].warehouse_name,
        });
      }
    });
  } else {
    res.sendStatus(401);
  }
});

router.post("/:id", (req, res) => {
  if (req.isAuthenticated()) {
    var proposal = new Proposal(
      req.user.id,
      req.params.id,
      req.body.start_date,
      req.body.end_date,
      req.body.quantity
    );

    proposal.save((err, done) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.send("Proposal Sent");
      }
    });
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
