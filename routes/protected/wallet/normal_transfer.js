const Wallet = require("../../../db/models/wallet");


const router = require("express").Router();


router.post("/normal_transfer", (req, res) => {
    let {sender, reciever, amount, desc} = req.body;
    let wallet = new Wallet;

    if(sender == reciever){
        res.send("Operation not permitted");
        return;
    }


    if(req.isAuthenticated() ){
        if(req.user.phno == "0000000000" && typeof(sender) != "undefined"){
            wallet.get_by_phone_no(sender, (err, sender)=>{
                if(err){
                    if(err == "no user found"){
                        res.send("no account with sender's ph no");
                    }
                    else{
                        res.sendStatus(500);
                    }
                }
                else{
                    wallet.get_by_phone_no(reciever, (err, reciever)=>{
                        if(err){
                            if(err == "no user found"){
                                res.send("no account with reciever's ph no");
                            }
                            else{
                                res.sendStatus(500);
                            }
                        }
                        else{
                            if(sender[0].id == reciever[0].id){
                                res.send("Operation not permitted");
                                return;
                            }
                            if(parseInt(sender[0].available_amt) > amount){
                                wallet.normal_transfer(sender[0].id ,reciever[0].id,amount,desc, (err, success)=>{
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
                            else{
                                res.send("Insufficient balance");
                            }
                    }
                    })
                    
                }
            })
            
        }
        else{
            wallet.get_by_user_id(req.user.id, (err, sender)=>{
                if(err){
                    res.sendStatus(500);
                }
                else{
                    wallet.get_by_phone_no(reciever, (err, reciever)=>{
                        if(err){
                            if(err == "no user found"){
                                res.send("no account with reciever's ph no");
                            }
                            else{
                                res.sendStatus(500);
                            }
                        }
                        else{
                            if(sender[0].id == reciever[0].id){
                                res.send("Operation not permitted");
                                return;
                            }
                            if(parseInt(sender[0].available_amt) > amount){
                                wallet.normal_transfer(sender[0].id ,reciever[0].id,amount,desc, (err, success)=>{
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
                            else{
                                res.send("Insufficient balance");
                            }
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