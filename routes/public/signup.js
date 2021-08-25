const { response } = require("express");
const User = require("./../../db/models/user");
const router = require("express").Router();

router.get("/", (req,res)=>{
    res.render("signup", {e: ""});
})

router.post("/", (req, res) => {
    let {fname, lname, phno, aadhar_no, password} = req.body;
    phno
    let users = new User(fname, lname, phno, aadhar_no, null, password);

    users.save((err, success)=>{
        if(err){
            if(err.code == '23505'){
                if(err.constraint == "idx_users_phno"){
                    res.render("signup", {e: "account with phone already exist"});
                }
                else if(err.constraint == "idx_users_aadhar"){
                    res.render("signup", {e: "account with aadhar already exist"});
                }

            }
            else{
                console.log(err);
            }
        }
        else{
            res.redirect("/");
        }
    })
});

module.exports = router;