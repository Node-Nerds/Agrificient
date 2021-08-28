const router = require("express").Router();

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("aggregator/home");
  } else {
    res.redirect("/");
  }
});

module.exports = router;
