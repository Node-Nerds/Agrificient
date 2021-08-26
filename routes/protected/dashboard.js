
const router = require("express").Router();


router.get("/",(req, res) => {
    if(req.isAuthenticated()){
        res.render("dashboard");

    }
    else{
        res.redirect("/");
    }
})




module.exports = router;