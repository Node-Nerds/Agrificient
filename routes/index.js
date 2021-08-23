const router = require("express").Router();

const public = require("./public/index");
const protected = require("./protected/index");



router.use("/", public);
router.use("/", protected);


module.exports = router;

