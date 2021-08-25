const Wallet = require("../../../db/models/wallet");


const router = require("express").Router();


router.post("/get_sender_info", (req, res) => {
    let {transaction_id} = req.body;
    let wallet = new Wallet;
    if(req.isAuthenticated()){
        wallet.get_sender_info(transaction_id, (err, found)=>{
            if(err){
                if(err == "no such transaction"){
                    res.send(err);
                }
                else{
                    res.sendStatus(500);
                }
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