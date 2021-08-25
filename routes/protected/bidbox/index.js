const router = require("express").Router();


const bidbox = require("./bidbox");
const add_product = require("./add_product");
const search_open_bid = require("./search_open_bid");
const product = require("./product");
const create_bid =require("./create_bid");
const bid_history = require("./bid_history");
const fetch_user_products = require("./fetch_user_products");

router.use("/", add_product);
router.use("/", bidbox);
router.use("/", search_open_bid);
router.use("/", product);
router.use("/", create_bid);
router.use("/", bid_history);
router.use("/", fetch_user_products);

module.exports = router;