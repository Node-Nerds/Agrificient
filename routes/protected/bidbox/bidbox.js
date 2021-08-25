
const router = require("express").Router();


router.get("/",(req, res) => {
    if(req.isAuthenticated()){
        res.render("bidbox/dashboard", {user: req.user});
    }
    else{
        res.redirect("/login");
    }
})


module.exports = router;