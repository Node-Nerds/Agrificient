const Wallet = require("../../../db/models/wallet");


const router = require("express").Router();


router.post("/transaction_history", (req, res) => {
    let {phno} = req.body;
    let wallet = new Wallet;
    if(req.isAuthenticated() ){
        if(req.user.phno == "0000000000" && typeof(phno) != "undefined"){
            wallet.get_by_phone_no(phno, (err, found)=>{
                if(err){
                    if(err == "no user found"){
                        res.send("no account with given ph no");
                    }
                    else{
                        res.sendStatus(500);
                    }
                }
                else{
                    wallet.transaction_history(found[0].id , (err, history)=>{
                        if(err){
                            console.log(err);
                            if(err = "no user found"){
                                res.sendStatus(404);
                            }
                            else{
                                res.sendStatus(500);
                            }
                        }
                        else{
                            
                            res.send(history);
                        }
                    })
                }
            })
            
        }
        else{
            wallet.get_by_user_id(req.user.id, (err, found)=>{
                if(err){
                    res.sendStatus(500);
                }
                else{
                    wallet.transaction_history(found[0].id , (err, history)=>{
                        if(err){
                            console.log(err);
                            if(err = "no user found"){
                                res.sendStatus(404);
                            }
                            else{
                                res.sendStatus(500);
                            }
                        }
                        else{
                            
                            res.send(history);
                        }
                    })
                }
            })
        }
    }
    else{
        res.sendStatus(401);
    }
});

module.exports = router;