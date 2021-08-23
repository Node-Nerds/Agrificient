const Warehouse = require("./../../../db/models/warehouse");
const router = require("express").Router();

router.get("/searchwarehouse", (req, res) => {
  res.render("warehouse/searchwarehouse.ejs");
});

router.post("/searchwarehouse", (req, res) => {
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
});

module.exports = router;
