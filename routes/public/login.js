
const router = require("express").Router();

const passport = require("passport");

router.get("/",(req, res) => {
    res.render("login", {message: req.flash('error')});
})

// router.post("/login", (req, res) => {
//     passport.authenticate('local', function (err, user, info) {
//         if (err) {
//             return next(err)
//         } else if (!user) { 
//             return res.render('login', {message: "Invalid credentials"}); 
//         } else {
//             console.log(req.user);
//             res.redirect("/home");
//         }
//     })(req, res);
// })

router.post('/',
  passport.authenticate('local', { successRedirect: '/dashboard',
                                   failureRedirect: '/',
                                   failureFlash: true })
);

module.exports = router;