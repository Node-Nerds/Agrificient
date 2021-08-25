const Warehouse = require("./../../../db/models/warehouse");
const router = require("express").Router();

router.get("/addwarehouse", (req, res) => {
  res.render("warehouse/addwarehouse.ejs");
});

router.post("/addwarehouse", (req, res) => {
  console.log(req.body);

  const warehouse = new Warehouse(
    req.body.name,
    req.body.phone,
    req.body.x,
    req.body.y,
    req.body.pincode,
    req.body.address
  );

  console.log(warehouse);

  warehouse.save((err, done) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;
