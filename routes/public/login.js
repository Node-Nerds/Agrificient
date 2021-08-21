
const router = require("express").Router();

const passport = require("passport");

router.get("/login",(req, res) => {
    
    res.render("login");
})

router.post("/login", passport.authenticate('local'), (req, res) => {
    console.log(req.user);
    res.send(req.user);
})



module.exports = router;