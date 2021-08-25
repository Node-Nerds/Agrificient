const router = require("express").Router();

const warehouseHome = require("./home");
const addWarehouse = require("./addWarehouse");
const searchWarehouse = require("./searchWarehouse");


router.use("/", warehouseHome);
router.use("/addwarehouse", addWarehouse);
router.use("/searchwarehouse", searchWarehouse);

module.exports = router;