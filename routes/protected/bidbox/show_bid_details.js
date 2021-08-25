const Bid = require("../../../db/models/bid");

const router = require("express").Router();


router.get("/bid_history/:bid_id",(req, res) => {
    if(req.isAuthenticated()){
        let bid = new Bid();

        bid.get_by_id(req.params.bid_id, (err, found)=>{
            if(err){
                console.log(err);
                res.render("error500");
            }
            else{
                res.render("bidbox/bid_details",{bid: found});
            }
        })
    }
    else{
        res.redirect("/");
    }
})


module.exports = router;