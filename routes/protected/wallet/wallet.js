const Wallet = require("../../../db/models/wallet");


const router = require("express").Router();


router.get("/", (req, res) => {
    
    let wallet = new Wallet;


    if(req.isAuthenticated() ){
            wallet.get_by_user_id(req.user.id, (err, wallet)=>{
                if(err){
                    console.log(err);
                    res.render("error500");
                }
                else{
                    res.render("wallet/wallet",{wallet: wallet});
                }
            })
    }
    else{
        res.redirect("/");
    }
});

module.exports = router;