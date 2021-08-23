
const router = require("express").Router();

const passport = require("passport");

router.get("/login",(req, res) => {
    
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

router.post('/login',
  passport.authenticate('local', { successRedirect: '/home',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

module.exports = router;