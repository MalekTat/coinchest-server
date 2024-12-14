const router = require("express").Router();
const bcryptjs = require('bcryptjs');
const { isAuthenticated } = require('../middlewares/jwt.middleware');
const uploader = require('../middlewares/cloudinary.config');
const UserModel = require('../models/User.model');

router.put('/edit', isAuthenticated, uploader.single('profilePhoto'), async (req, res) => {
  const { username, email, password } = req.body;
  const profilePhoto = req.file?.path;

  try {

    const usernameExists = await UserModel.findOne({ username, _id: { $ne: req.payLoad.currentUser._id } });
    const emailExists = await UserModel.findOne({ email, _id: { $ne: req.payLoad.currentUser._id } });

    if (usernameExists || emailExists) {
      return res.status(400).json({ message: 'Email or Username already exists.' });
    }


    // Update user data
    const updatedData = { username, email };
    if (password) {
      const salt = bcryptjs.genSaltSync(12);
      updatedData.password = bcryptjs.hashSync(password, salt);
    }
    if (profilePhoto) updatedData.profilePhoto = profilePhoto;

    const updatedUser = await UserModel.findByIdAndUpdate(req.payLoad.currentUser._id, updatedData, { new: true });
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update profile.' });
  }
});



router.delete('/delete', isAuthenticated, async (req, res) => {
    try {
      await UserModel.findByIdAndDelete(req.payLoad.currentUser._id);
      res.status(200).json({ message: 'Account deleted successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to delete account.' });
    }
  });

  module.exports = router;