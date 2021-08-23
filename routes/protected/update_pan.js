const User = require("../../db/models/user");

const router = require("express").Router();


router.post("/",(req, res) => {
    if(req.isAuthenticated()){
        let {pan, product_id} = req.body;

        let user = new User();

        user.update_pan(pan, req.user.id, (err, done)=>{
            if(err){
                console.log(err);
                res.render("error500");
            }
            else{
                if(typeof(product_id) != "undefined" || product_id != "undefined" || product_id != ""){
                    req.user.pan_no = pan;
                    res.redirect("/bidbox/create_bid/"+product_id);
                }
                else{
                    res.redirect("/home");
                }
            }
        })

    }
    else{
        res.redirect("/login");
    }
})


module.exports = router;