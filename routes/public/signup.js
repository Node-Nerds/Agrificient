const { response } = require("express");
const User = require("./../../db/models/user");
const router = require("express").Router();

router.get("/signup", (req,res)=>{
    res.render("signup");
})

router.post("/signup", (req, res) => {
    let {fname, lname, phno, aadhar_no, password} = req.body;
    phno
    let users = new User(fname, lname, phno, aadhar_no, null, password);

    users.save((err, success)=>{
        if(err){
            if(err.code == '23505'){
                if(err.constraint == "idx_users_phno"){
                    res.send("account with phone no already exists");
                }
                else if(err.constraint == "idx_users_aadhar"){
                    res.send("account with aadhar no already exists");
                }

            }
            else{
                console.log(err);
            }
        }
        else{
            res.redirect("/login");
        }
    })
});

module.exports = router;