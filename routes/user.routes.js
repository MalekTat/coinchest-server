const router = require("express").Router();
const UserModel = require("../models/User.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");


router.get("/", isAuthenticated, async (req, res, next) => {
  const { _id } = req.payLoad.currentUser;
  try {
    const user = await UserModel.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      res.json({ _id: user._id, username: user.username, email: user.email , current : req.payLoad.currentUser});
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;