const Wallet = require("../../../db/models/wallet");


const router = require("express").Router();


router.post("/update_trans_status", (req, res) => {
    let {id, status} = req.body;
    let wallet = new Wallet;
    if(req.isAuthenticated() && req.user.phno == "0000000000"){
        
            wallet.update_trans_status(id,status,(err,found)=>{
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