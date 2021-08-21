const Wallet = require("../../../db/models/wallet");


const router = require("express").Router();


router.post("/quick_transact", (req, res) => {
    let {phno, amount, type} = req.body;
    let wallet = new Wallet;

    let desc;

    if(type == "credit"){
      desc= "add margin";
    }
    else if(type == "debit"){
      desc = "withdraw margin";
    }


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
                    if(type == "debit" && amount > parseInt(found[0].available_amt)){
                        res.send("Insufficient Balance to withdraw");
                    }
                    else{
                        wallet.quick_transact(found[0].id ,amount,type,desc, (err, success)=>{
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
                                
                                res.send("successfull");
                            }
                        })
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
                    if(type == "debit" && amount >parseInt(found[0].available_amt)){
                        res.send("Insufficient Balance to withdraw");
                    }
                    else{
                        wallet.quick_transact(found[0].id ,amount,type,desc, (err, success)=>{
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
                                
                                res.send("successfull");
                            }
                        })
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