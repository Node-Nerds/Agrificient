
const router = require("express").Router();

const passport = require("passport");

router.get("/",(req, res) => {
    
    res.render("otpLogin");
})

router.post("/", passport.authenticate('otp', { successRedirect: '/dashboard',
failureRedirect: '/',
failureFlash: true }),
(req, res) => {
    console.log(req.body);
  
})



module.exports = router;