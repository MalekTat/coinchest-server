const router = require("express").Router();


router.get("/", (req, res) => {
  res.send("Welcome to the Coinchest Server!");
});


router.get("/api", (req, res, next) => {
  res.json("All good in here");
});

module.exports = router;
