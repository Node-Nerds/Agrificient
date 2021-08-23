const Bid = require("../../../db/models/products");

const router = require("express").Router();


router.post("/search_open_bid",(req, res) => {

    let bid = new Bid();
    if(req.isAuthenticated()){
        console.log(req.body);
        if (req.body.pincode != null) {
            bid.fetch_open_by_pin(req.body.pincode, req.user.id,(err, bid) => {
              if (err) {
                console.log(err);
                res.render("error500");
              } else {
                console.log(bid);
                res.send(bid);
              }
            });
          } else {
            bid.fetch_open_by_pos(
              req.body.latitude,
              req.body.longitude,
              req.user.id,
              (err, bid) => {
                if (err) {
                  console.log(err);
                  res.sendStatus(500);
                } else {
                  console.log(bid);
                  res.send(bid);
                }
              }
            );
          }
    }
    else{
        res.redirect("/login");
    }
})


module.exports = router;