const Bid = require("../../../db/models/bid");
const Products = require("../../../db/models/products");

const router = require("express").Router();


router.get("/product/:product_id",(req, res) => {
    if(req.isAuthenticated()){
        let product = new Products;
        let bid = new Bid(); 

        product.fetch_product_by_id(req.params.product_id, (err, found)=>{
            if(err){
                console.log(err);
                res.render("error500");
            }
            else{
                bid.get_max_bid(req.params.product_id, (err, max_bid)=>{
                    if(err){
                        console.log(err);
                        res.render("error500");
                    }
                    else{
                        console.log(max_bid);
                        if(max_bid[0].maximum == '0'){
                            res.render("bidbox/product",{product : found, max_bid: found[0].base_price, quantity: max_bid[0].quantity});
                        }
                        else{
                            res.render("bidbox/product",{product : found, max_bid: max_bid[0].maximum,  quantity: max_bid[0].quantity});
                        }
                        console.log(found);
                        
                    }
                })
                
            }
        })
    }
    else{
        res.redirect("/");
    }
})


module.exports = router;