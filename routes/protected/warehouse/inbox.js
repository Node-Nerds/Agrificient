const Warehouse = require("../../../db/models/warehouse");
const Proposal = require("../../../db/models/proposal");
const router = require("express").Router();

router.get("/", (req, res) => {
  var proposal = new Proposal();

  proposal.findInbox(req.user.id, (err, data) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.render("warehouse/inbox.ejs", {
        inboxes: data,
      });
    }
  });
});

router.post("/", (req, res) => {
  var proposal = new Proposal();

  proposal.approve(req.body.pid, (err, done) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.send("Proposal Sent");
    }
  });
});

module.exports = router;
