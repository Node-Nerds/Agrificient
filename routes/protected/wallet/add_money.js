const Wallet = require("../../../db/models/wallet");


const router = require("express").Router();

router.get("/add_money", (req, res) => {
    
    let wallet = new Wallet;


    if(req.isAuthenticated() ){
        res.render("wallet/add_funds",{wallet: wallet});
    }
    else{
        res.redirect("/");
    }
});


router.post("/add_money", (req, res) => {
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
                    wallet.add_money(found[0].id ,amount, (err, success)=>{
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
            })
            
        }
        else{
            wallet.get_by_user_id(req.user.id, (err, found)=>{
                if(err){
                    res.sendStatus(500);
                }
                else{
                    wallet.add_money(found[0].id ,amount, (err, success)=>{
                        if(err){
                            console.log(err);
                            res.sendStatus(500);
                        }
                        else{
                            res.send("Transaction waiting for confirmation");
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