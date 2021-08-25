
const User = require("./../../db/models/user");
const router = require("express").Router();

router.post("/get_user_profile", (req, res) => {
    let {phno} = req.body;
    if(req.isAuthenticated()){
        if(req.user.phno == "0000000000"){
            if(typeof(phno) != "undefined"){
                let user = new User();

                user.findByPhno(phno, (err, found)=>{
                    if(err){
                        console.log(err);
                        escape.sendStatus(500);
                    }
                    else{
                        if(found == null){
                            res.sendStatus(404);
                        }
                        else{
                            console.log(found);
                            delete found[0].password;
                            res.send(found[0]);
                        }
                    }
                })
            }
            else{
                delete req.user.password;
                res.send(req.user);
            }
        }
        else{
            delete req.user.password;
            res.send(req.user);
        }
    }
    else{
        res.sendStatus(401);
    }
});

module.exports = router;