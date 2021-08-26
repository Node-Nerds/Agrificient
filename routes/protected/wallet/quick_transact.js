const Wallet = require("../../../db/models/wallet");


const router = require("express").Router();


router.post("/quick_transact/:type", (req, res) => {
    let {phno, amount} = req.body;
    let type = req.params.type;
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
                        res.render("error404");
                    }
                    else{
                        res.render("error500");
                    }
                }
                else{
                    if(type == "debit" && amount > parseInt(found[0].available_amt)){
                        res.render("wallet/withdraw_funds",{wallet: wallet , e:"Insufficient Balance"});
                    }
                    else{
                        wallet.quick_transact(found[0].id ,amount,type,desc, (err, success)=>{
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
                                
                                res.redirect("/wallet/");
                            }
                        })
                    }
                    
                }
            })
            
        }
        else{
            wallet.get_by_user_id(req.user.id, (err, found)=>{
                if(err){
                    res.render("error500");
                }
                else{
                    if(type == "debit" && amount >parseInt(found[0].available_amt)){
                        res.render("wallet/withdraw_funds",{wallet: wallet , e:"Insufficient Balance"});
                    }
                    else{
                        wallet.quick_transact(found[0].id ,amount,type,desc, (err, success)=>{
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
                                
                                res.redirect("/wallet/");
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