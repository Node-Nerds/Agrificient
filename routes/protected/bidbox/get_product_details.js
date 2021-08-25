const Bid = require("../../../db/models/bid");
const Products = require("../../../db/models/products");

const router = require("express").Router();


router.get("/fetch_user_products/:product_id",(req, res) => {
    if(req.isAuthenticated()){
        let product = new Products();
        let bid = new Bid();

        product.fetch_product_by_id(req.params.product_id, (err, product)=>{
            if(err){
                console.log(err);
                res.render("error500");
            }
            else{
                if(product[0].result_staus == '0'){
                    bid.get_by_product_id(req.params.product_id, (err, found)=>{
                        if(err){
                            console.log(err);
                            res.render("error500");
                        }
                        else{
                            console.log(product, found)
                            res.render("bidbox/product_details",{bid: found , product: product});
                        }
                    })
                }
                else{
                    bid.get_accepted(req.params.product_id, (err, found)=>{
                        if(err){
                            console.log(err);
                            res.render("error500");
                        }
                        else{
                            console.log(product, found)
                            res.render("bidbox/product_details",{bid: found , product: product});
                        }
                    })
                }
                
            }
        })

        
    }
    else{
        res.redirect("/");
    }
})


module.exports = router;