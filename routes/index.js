const router = require("express").Router();

const addwarehouse = require("./protected/addWarehouse");
const searchwarehouse = require("./protected/searchWarehouse");
const warehouse = require("./protected/warehouse");
const proposal = require("./protected/proposal");

router.use("/", addwarehouse);
router.use("/", searchwarehouse);
router.use("/", warehouse);
router.use("/", proposal);

module.exports = router;
