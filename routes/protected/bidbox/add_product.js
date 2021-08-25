const Bid = require("../../../db/models/products");

const router = require("express").Router();


router.get("/add_product",(req, res) => {
    if(req.isAuthenticated()){
        let bid = new Bid();

        bid.get_product_cat((err, found)=>{
            if(err){
                res.render("error500");
            }
            else{
                console.log(found);
                found = found[0].enum_range.replace('{', '');
                found = found.replace('}', '');
                found = found.split(",");
                res.render("bidbox/add_product", {user: req.user, categories: found});
            }
        })
        
    }
    else{
        res.redirect("/");
    }
})


router.post("/add_product",(req, res) => {
    if(req.isAuthenticated()){
        console.log(req.body);
        let product = req.body;
        product["user_id"] = req.user.id;

        let bid = new Bid();
        bid.add_product(product, (err, done)=>{
            if(err){
                console.log(err);
                res.render("error500");
            }
            else{
                res.redirect("/bidbox/");
            }
        })
    }
    else{
        res.redirect("/");
    }
})



module.exports = router;