const router = require("express").Router();

const signup = require("./public/signup");
const login = require("./public/login");
const verify_phno = require("./public/verify_phno");

const home = require("./protected/home");
const addwarehouse = require("./protected/addWarehouse");
const searchwarehouse = require("./protected/searchWarehouse");
const get_user_profile = require("./protected/get_user_profile");
const update_pan = require("./protected/update_pan");

const wallet = require("./protected/wallet");
const bidbox = require("./protected/bidbox");

router.use("/", signup);
router.use("/", login);
router.use("/", verify_phno);

router.use("/", home);
router.use("/", addwarehouse);
router.use("/", searchwarehouse);
router.use("/", get_user_profile);
router.use("/", update_pan);

router.use("/wallet/", wallet);
router.use("/bidbox/",bidbox);


module.exports = router;

