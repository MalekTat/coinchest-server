const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middlewares/jwt.middleware");
const UserModel = require("../models/User.model");
const uploader = require('../middlewares/cloudinary.config');

//Sign Up route
router.post("/signup", uploader.single("profilePhoto"), async (req, res, next) => {
  
  //if (!req.file) {
  //  next(new Error('No file uploaded!'));
  //  return;
  //}

  const { username, email, password } = req.body;
  const profilePhoto = req.file?.path || 'https://res.cloudinary.com/dhvyrgmrq/image/upload/v1734197098/iqeyw6qdpum2w0ecqkcm.png';

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const emailIsExist = await UserModel.findOne({ email });
    const usernameExists = await UserModel.findOne({ username });

    if (emailIsExist || usernameExists) {
      res.status(403).json({ message: "Email or Username already exists." });
    } else {
      const salt = bcryptjs.genSaltSync(12);
      const hashedPassword = bcryptjs.hashSync(password, salt);
      const hashedUser = {
        username,
        email,
        password: hashedPassword,
        profilePhoto
      };
      const createdUser = await UserModel.create(hashedUser);
      res.status(201).json(createdUser);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ erroMessage: "error on signup" });
  }
});

//Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userIsExist = await UserModel.findOne({ email });
    if (userIsExist) {
      // preparing the password check
      const dbPassword = userIsExist.password;
      const loginPassword = password;

      //Password check
      const passwordsMatch = bcryptjs.compareSync(loginPassword, dbPassword);
      if (passwordsMatch) {
        //Dealing with the token
        const { _id, username, profilePhoto } = userIsExist;
        const token = jwt.sign({ _id, username }, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });


        //sending final response
        res.status(200).json({ 
          message: "login successed", 
          authToken: token,
          user: { _id, username, email, profilePhoto }, 
        });
      } else {
        return res.status(500).json({ message: "login failed wrong password" });
      }
    } else {
      return res.status(500).json({ message: "login failed wrong email" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "login failed " });
  }
});

router.get("/verify", isAuthenticated, (req, res) => {
  res.status(200).json(req.payLoad.currentUser);
});

module.exports = router;