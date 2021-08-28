const router = require("express").Router();

const aggregateHome = require("./home");
const addAggregator = require("./addAggregator");
const searchAggregator = require("./searchAggregator");

router.use("/", aggregateHome);
router.use("/addaggregator", addAggregator);
router.use("/searchAggregator", searchAggregator);

module.exports = router;
