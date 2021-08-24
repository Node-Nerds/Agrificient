const Bid = require("../../../db/models/bid");
const Products = require("../../../db/models/products");
const User = require("../../../db/models/user");
const Wallet = require("../../../db/models/wallet");
const datetime = require('node-datetime');

const router = require("express").Router();


router.get("/create_bid/:product_id",(req, res) => {
    if(req.isAuthenticated()){
        let bid = new Bid();
        let product = new Products()
        let wallet = new Wallet()
        
        if(req.user.pan_no != null || req.user.pan_no){
            wallet.get_by_user_id(req.user.id, (err, wallet)=>{
                if(err){
                    console.log(err);
                    res.render("error500");
                }
                else{
                    
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
                                    if(max_bid[0].maximum == '0'){
                                        res.render("bidbox/create_bid",{product : found, max_bid:found[0].base_price ,  quantity: found[0].quantity , user: req.user, wallet: wallet});
                                    }
                                    else{
                                        res.render("bidbox/create_bid",{product : found, max_bid: max_bid[0].maximum,  quantity: found[0].quantity,  user: req.user, wallet: wallet});
                                    }
                                    console.log(found);
                                    
                                }
                            })
                        }
                    })
                    
                
                }
            })
        }

        else{
            res.render("pan_input", {product_id: req.params.product_id});
        }
    }
    else{
        res.redirect("/");
    }
})

router.post("/create_bid/:product_id",(req, res) => {
    if(req.isAuthenticated()){
        let data = req.body;

        let wallet = new Wallet();

        data["product_id"] = req.params.product_id;
        data["user_id"] = req.user.id;
        let date = datetime.create();
        data["bid_date"]= date.format('Y-m-d');
        data["bid_time"] = date.format('H:M:S');



        let bid = new Bid();

        bid.create_bid(data, (err, done)=>{
            if(err){
                console.log(err);
                res.render("error500");
            }
            else{
                res.redirect("/bidbox/")
            }
        })
    }
    else{
        res.redirect("/");
    }
})


module.exports = router;