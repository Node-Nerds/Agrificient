const Wallet = require("../../../db/models/wallet");


const router = require("express").Router();


router.post("/get_wallet_details", (req, res) => {
    let {phno} = req.body;
    let wallet = new Wallet;
    if(req.isAuthenticated()){
        if(req.user.phno == "0000000000"){
            if(typeof(phno) != "undefined"){
                

                wallet.get_by_phone_no(phno, (err, found)=>{
                    if(err){
                        if(err = "no user found"){
                            res.sendStatus(404);

                        }
                        else{
                        res.sendStatus(500);

                        }
                        console.log(err);
                    }
                    else{
                        res.send(found[0]);
                    }
                })
            }
            else{
                
                wallet.get_by_user_id(req.user.id, (err, found)=>{
                    if(err){
                        console.log(err);
                        res.sendStatus(500);
                    }
                    else{
                        res.send(found[0]);
                    }
                })
            }
        }
        else{
            wallet.get_by_user_id(req.user.id, (err, found)=>{
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
                    res.send(found[0]);
                }
            })
        }
    }
    else{
        res.sendStatus(401);
    }
});

module.exports = router;