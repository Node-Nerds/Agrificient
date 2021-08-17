const router = require("express").Router();

const addwarehouse = require("./protected/addWarehouse");
const searchwarehouse = require("./protected/searchWarehouse");

router.use("/", addwarehouse);
router.use("/", searchwarehouse);

module.exports = router;
