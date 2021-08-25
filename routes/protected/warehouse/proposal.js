const Warehouse = require("../../../db/models/warehouse");
const Proposal = require("../../../db/models/proposal");
const router = require("express").Router();

router.get("/", (req, res) => {
  var proposal = new Proposal();
  var warehouse = new Warehouse();

  proposal.findById(req.user.id, (err, data) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      var warehouse_ids = [];
      var map = {};

      for (var i = 0; i < data.length; i++) {
        warehouse_ids.push(data[i].warehouse_id);
      }

      warehouse.findById(warehouse_ids, (err, output) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          for (var i = 0; i < output.length; i++) {
            map[output[i].id] = output[i].warehouse_name;
          }

          for (var i = 0; i < data.length; i++) {
            data[i].warehouse_name = map[data[i].warehouse_id];
          }

          res.render("warehouse/proposals.ejs", {
            proposals: data,
          });
        }
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
