const Warehouse = require("./../../../db/models/warehouse");
const router = require("express").Router();

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("warehouse/searchwarehouse.ejs");
  } else {
    res.sendStatus(401);
  }
});

router.post("/", (req, res) => {
  if (req.isAuthenticated()) {
    const warehouse = new Warehouse();

    if (req.body.pincode != null) {
      warehouse.findByPincode(req.body.pincode, (err, warehouses) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          res.send(warehouses);
        }
      });
    } else {
      warehouse.findByPos(
        req.body.latitude,
        req.body.longitude,
        (err, warehouses) => {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else {
            res.send(warehouses);
          }
        }
      );
    }
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
