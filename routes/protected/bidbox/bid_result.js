const Bid = require("../../../db/models/bid");
const Products = require("../../../db/models/products");
const Wallet = require("../../../db/models/wallet");

const router = require("express").Router();


router.get("/bid_result/:product_id",(req, res) => {
    if(req.isAuthenticated()){
        let product = new Products();
        let bid = new Bid();
        let wallet = new Wallet();

        product.fetch_product_by_id(req.params.product_id, (err, product)=>{
            if(err){
                console.log(err);
                res.render("error500");
            }
            else{
                bid.get_by_product_id(req.params.product_id, (err, bids)=>{
                    if(err){
                        console.log(err);
                        res.render("error500");
                    }
                    else{
                        let quantity = parseInt(product[0].quantity);
                        let accepted_bids = [];
                        
                        if(bids == null){
                            res.send("No bids");
                            return;
                        }
                        
                        var bar = new Promise((resolve, reject) => {
                            
                            bids.forEach((b, i)=>{
                                
                                
                                b.max_quantity = parseInt( b.max_quantity);
                                b.min_quantity = parseInt( b.min_quantity);
                                console.log(quantity >= b.max_quantity);
                                console.log((quantity < b.max_quantity) && (quantity >= b.min_quantity));
                                if(quantity >= b.max_quantity){
                                    b.alloted = b.max_quantity;
                                    quantity -= b.max_quantity;
                                    b.status = 1;
                                    accepted_bids.push(b);
                                }
                                else if((quantity < b.max_quantity) && (quantity >= b.min_quantity)){
                                    b.alloted = quantity;
                                    quantity -= quantity;
                                    b.status = 1;
                                    accepted_bids.push(b);
                                }
                                console.log(b, quantity);
                                console.log((quantity == 0));
                                if(quantity == 0) {
                                    resolve();
                                    bids.length = 0;
                                }
                                if (i === bids.length -1) resolve();
                            })
                        });
                        
                        bar.then(() => {
                            wallet.get_by_user_id(product[0].user_id, (err, wallet)=>{
                                if(err){
                                    console.log(err);
                                    res.render("error500");
                                }
                                else{
                                    console.log(wallet);
                                    // res.send({quantity_left: quantity, accepted_bids: accepted_bids});
                                    bid.accept_bids(accepted_bids, wallet[0].id, (err, done)=>{
                                        if(err){
                                            console.log(err);
                                            
                                        }
                                        else{
                                            res.send(accepted_bids);
                                        }
                                    })
                                }
                            })
                            
                        });

                        
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
