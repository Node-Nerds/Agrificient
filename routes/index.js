const router = require("express").Router();

const public = require("./public/index");

const home = require("./protected/home");
const addwarehouse = require("./protected/addWarehouse");
const searchwarehouse = require("./protected/searchWarehouse");
const get_user_profile = require("./protected/get_user_profile");

const wallet = require("./protected/wallet");

router.use("/", public);


router.use("/", home);
router.use("/", addwarehouse);
router.use("/", searchwarehouse);
router.use("/", get_user_profile);

router.use("/wallet/", wallet);


module.exports = router;

