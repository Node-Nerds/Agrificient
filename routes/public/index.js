const router = require("express").Router();

const signup = require("./signup");
const login = require("./login");
const verify_phno = require("./verify_phno");
const forgot_password = require("./forgot_password");
const otpLogin = require("./otpLogin");


router.use("/otpLogin", otpLogin);
router.use("/signup", signup);
router.use("/", login);
router.use("/verify_phno", verify_phno);
router.use("/forgotassword", forgot_password);



module.exports = router;

