const router = require("express").Router();


const bidbox = require("./bidbox");
const add_product = require("./add_product");
const search_open_bid = require("./search_open_bid");
const product = require("./product");
const create_bid =require("./create_bid");
const bid_history = require("./bid_history");
const fetch_user_products = require("./fetch_user_products");
const show_bid_details = require("./show_bid_details");
const get_product_details = require("./get_product_details");
const bid_result = require("./bid_result");

router.use("/", add_product);
router.use("/",bidbox);
router.use("/", search_open_bid);
router.use("/", product);
router.use("/", create_bid);
router.use("/", bid_history);
router.use("/", fetch_user_products);
router.use("/", show_bid_details);
router.use("/", get_product_details);
router.use("/", bid_result);

module.exports = router;