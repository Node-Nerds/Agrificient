const router = require("express").Router();

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("home");
  } else {
    res.redirect("/");
  }
});

module.exports = router;
