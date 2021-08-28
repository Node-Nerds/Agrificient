const router = require("express").Router();

const dashboard = require("./dashboard");
const get_user_profile = require("./get_user_profile");
const wallet = require("./wallet/index");
const warehouse = require("./warehouse/index");
const update_pan = require("./update_pan");
const bidbox = require("./bidbox");
const aggregator = require("./aggregator");

router.use("/dashboard", dashboard);
router.use("/get_user_profile", get_user_profile);
router.use("/wallet", wallet);
router.use("/warehouse", warehouse);
router.use("/update_pan", update_pan);
router.use("/bidbox", bidbox);
router.use("/aggregator", aggregator);

module.exports = router;
