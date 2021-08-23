const router = require("express").Router();

const dashboard = require("./dashboard");
const get_user_profile = require("./get_user_profile");
const wallet = require("./wallet/index");
const warehouse = require("./warehouse/index");

router.use("/dashboard", dashboard);
router.use("./get_user_profile", get_user_profile);
router.use("./wallet", wallet);
router.use("./warehouse", warehouse);

module.exports = router;
