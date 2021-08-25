const router = require("express").Router();

const warehouseHome = require("./home");
const addWarehouse = require("./addWarehouse");
const searchWarehouse = require("./searchWarehouse");
const customwarehouse = require("./customwarehouse");
const proposal = require("./proposal");

router.use("/", warehouseHome);
router.use("/addwarehouse", addWarehouse);
router.use("/searchwarehouse", searchWarehouse);
router.use("/proposal", proposal);
router.use("/custom/", customwarehouse);

module.exports = router;
