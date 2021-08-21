const Wallet = require("../../../db/models/wallet");


const router = require("express").Router();


router.post("/withdraw_money", (req, res) => {
    let {phno, amount} = req.body;
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
                    console.log(found);
                    if(found[0].available_amt > amount){
                        wallet.withdraw_money(found[0].id ,amount, (err, success)=>{
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
                                
                                res.send("Transaction waiting for confirmation");
                            }
                        })
                    }
                    else{
                        res.send("Insufficient balance for transaction");
                    }
                    
                }
            })
            
        }
        else{
            wallet.get_by_user_id(req.user.id, (err, found)=>{
                if(err){
                    res.sendStatus(500);
                }
                else{
                    if(found[0].available_amt > amount){
                        wallet.withdraw_money(found[0].id ,amount, (err, success)=>{
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
                                
                                res.send("Transaction waiting for confirmation");
                            }
                        })
                    }
                    else{
                        res.send("Insufficient balance for transaction");
                    }
                }
            })
        }
    }
    else{
        res.sendStatus(401);
    }
});

module.exports = router;