const Warehouse = require("./../../../db/models/warehouse");
const router = require("express").Router();

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("warehouse/addwarehouse.ejs");
  } else {
    res.sendStatus(401);
  }
});

router.post("/", (req, res) => {
  if (req.isAuthenticated()) {
    const warehouse = new Warehouse(
      req.body.name,
      req.user.id,
      req.body.phone,
      req.body.x,
      req.body.y,
      req.body.pincode,
      req.body.address
    );

    warehouse.save((err, done) => {
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
