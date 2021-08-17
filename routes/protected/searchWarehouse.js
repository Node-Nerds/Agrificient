const Warehouse = require("../../db/models/warehouse");
const router = require("express").Router();

router.post("/searchwarehouse", (req, res) => {
  const warehouse = new Warehouse();

  warehouse.find((err, warehouses) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.send(warehouses);
    }
  });
});

module.exports = router;
