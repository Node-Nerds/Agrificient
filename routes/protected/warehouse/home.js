
const router = require("express").Router();


router.get("/home",(req, res) => {
    console.log(req.isAuthenticated())
    if(req.isAuthenticated()){
        res.render("home");
    }
    else{
        res.redirect("/");
    }
})


module.exports = router;