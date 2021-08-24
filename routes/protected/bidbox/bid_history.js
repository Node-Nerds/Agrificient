const Bid = require("../../../db/models/bid");
const Products = require("../../../db/models/products");

const router = require("express").Router();


router.get("/bid_history",(req, res) => {
    if(req.isAuthenticated()){
        let bid = new Bid()

        bid.bid_history(req.user.id, (err, found)=>{
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
        res.redirect("/");
    }
})


module.exports = router;