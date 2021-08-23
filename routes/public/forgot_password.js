
const router = require("express").Router();

const passport = require("passport");

router.get("/",(req, res) => {
    
    res.render("forgot_password");
})

router.post("/", passport.authenticate('local'), (req, res) => {
    console.log(req.user);
    res.send(req.user);
})



module.exports = router;