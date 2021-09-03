const router = require("express").Router();

const forecasting = require("./forecasting");

router.use("/", forecasting);

module.exports = router;
