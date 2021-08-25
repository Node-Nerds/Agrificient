const router = require("express").Router();

const warehouseHome = require("./home");
const addWarehouse = require("./addWarehouse");
const searchWarehouse = require("./searchWarehouse");


router.use("/home", warehouseHome);
router.use("./addWarehouse", addWarehouse);
router.use("./searchWareHouse", searchWarehouse);

module.exports = router;