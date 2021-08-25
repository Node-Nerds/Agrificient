const Warehouse = require("../../db/models/warehouse");
const Proposal = require("../../db/models/proposal");
const router = require("express").Router();

router.get("/proposal", (req, res) => {
  var proposal = new Proposal();

  proposal.findById("CodeSocks12", (err, data) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.render("warehouse/proposals.ejs", {
        proposals: data,
      });
    }
  });
});

// router.post("/warehouse/:id", (req, res) => {
//   var proposal = new Proposal(
//     req.params.id,
//     req.body.name,
//     req.body.phone,
//     req.body.start_date,
//     req.body.end_date,
//     req.body.quantity
//   );

//   console.log(proposal);

//   proposal.save((err, done) => {
//     if (err) {
//       console.log(err);
//       res.sendStatus(500);
//     } else {
//       res.send("Proposal Sent");
//     }
//   });
// });

module.exports = router;
