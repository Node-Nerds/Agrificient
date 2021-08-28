const router = require("express").Router();


const get_wallet_details = require("./get_wallet_details");
const add_money = require("./add_money");
const get_pending_transacrtion = require("./get_pending_trans");
const update_trans_status = require("./update_trans_status");
const quick_transact = require("./quick_transact");
const withdraw_money = require("./withdraw_money");
const block_unblock_money = require("./block_unblock_money");
const normal_transfer = require("./normal_transfer");
const blocked_transfer = require("./blocked_transfer");
const transaction_history = require("./transaction_history");
const get_sender_info = require("./get_sender_info");
const wallet = require("./wallet");

router.use("/", get_wallet_details);
router.use("/", add_money);
router.use("/", get_pending_transacrtion);
router.use("/", update_trans_status);
router.use("/", quick_transact);
router.use("/", withdraw_money);
router.use("/", block_unblock_money);
router.use("/", normal_transfer);
router.use("/", blocked_transfer);
router.use("/", transaction_history);
router.use("/", get_sender_info);
router.use("/", wallet);

module.exports = router;