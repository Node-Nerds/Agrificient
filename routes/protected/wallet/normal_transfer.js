const Wallet = require("../../../db/models/wallet");


const router = require("express").Router();

router.get("/normal_transfer", (req, res) => {
    
    let wallet = new Wallet;


    if(req.isAuthenticated() ){
        res.render("wallet/transfer_funds",{wallet: wallet, e:""});
    }
    else{
        res.redirect("/");
    }
});


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
                        res.render("wallet/transfer_funds",{wallet: wallet, e:"reciever not found"});
                    }
                    else{
                        res.render("error500");
                    }
                }
                else{
                    wallet.get_by_phone_no(reciever, (err, reciever)=>{
                        if(err){
                            if(err == "no user found"){
                                res.render("wallet/transfer_funds",{wallet: wallet, e:"reciever not found"});
                            }
                            else{
                                res.render("error500");
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
                                            res.render("error404");
                                        }
                                        else{
                                            res.render("error500");
                                        }
                                    }
                                    else{

                                        res.redirect("/wallet/")
                                    }
                                })
                            }
                            else{
                                res.render("wallet/transfer_funds",{wallet: wallet, e:"Insufficient balance"});
                            }
                    }
                    })
                    
                }
            })
            
        }
        else{
            wallet.get_by_user_id(req.user.id, (err, sender)=>{
                if(err){
                    res.render("error500");
                }
                else{
                    wallet.get_by_phone_no(reciever, (err, reciever)=>{
                        if(err){
                            if(err == "no user found"){
                                res.render("wallet/transfer_funds",{wallet: wallet, e:"reciever not found"});
                            }
                            else{
                                res.render("error500");
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
                                            res.render("wallet/transfer_funds",{wallet: wallet, e:"reciever not found"});
                                        }
                                        else{
                                            res.render("error500");
                                        }
                                    }
                                    else{

                                        res.send("successfull");
                                    }
                                })
                            }
                            else{
                                res.render("wallet/transfer_funds",{wallet: wallet, e:"Insufficient balance"});
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