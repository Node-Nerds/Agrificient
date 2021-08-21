
const router = require("express").Router();


router.post("/verify_phno", (req, res) => {
    console.log(req.body);
})



module.exports = router;