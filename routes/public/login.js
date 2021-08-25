
const router = require("express").Router();

const passport = require("passport");

router.get("/",(req, res) => {
    res.render("login", {message: req.flash('error')});
})



router.post('/',
  passport.authenticate('local', { successRedirect: '/dashboard',
                                   failureRedirect: '/',
                                   failureFlash: true })
);

module.exports = router;