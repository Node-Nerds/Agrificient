const router = require("express").Router();

const warehouseHome = require("./home");
const addWarehouse = require("./addWarehouse");
const searchWarehouse = require("./searchWarehouse");
const customwarehouse = require("./customwarehouse");
const proposal = require("./proposal");
const inbox = require("./inbox");

router.use("/", warehouseHome);
router.use("/addwarehouse", addWarehouse);
router.use("/searchwarehouse", searchWarehouse);
router.use("/custom/", customwarehouse);
router.use("/proposal", proposal);
router.use("/inbox", inbox);

module.exports = router;
