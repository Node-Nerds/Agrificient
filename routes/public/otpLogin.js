
const router = require("express").Router();

const passport = require("passport");

router.get("/",(req, res) => {
    
    res.render("otpLogin");
})

router.post("/", passport.authenticate('local'), (req, res) => {
    console.log(req.user);
    res.send(req.user);
})



module.exports = router;