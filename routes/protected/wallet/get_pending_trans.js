const Wallet = require("../../../db/models/wallet");


const router = require("express").Router();


router.post("/get_pending_trans", (req, res) => {
    let wallet = new Wallet;
    if(req.isAuthenticated() && req.user.phno == "0000000000"){
        
            wallet.get_pending_trans((err,found)=>{
                if(err){
                    console.log(err);
                    res.sendStatus(500);
                }
                else{
                    res.send(found);
                }
            })
            
        
    }
    else{
        res.sendStatus(401);
    }
});

module.exports = router;