const Bid = require("../../../db/models/bid");
const Products = require("../../../db/models/products");

const router = require("express").Router();


router.get("/fetch_user_products",(req, res) => {
    if(req.isAuthenticated()){
        let product = new Products()

        product.fetch_user_products(req.user.id, (err, found)=>{
            if(err){
                console.log(err);
                res.render("error500");
            }
            else{
                res.send(found);
            }
        })
    }
    else{
        res.redirect("/login");
    }
})


module.exports = router;