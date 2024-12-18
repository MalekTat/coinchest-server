const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');


cloudinary.config({
  cloud_name: 'dhvyrgmrq',
  api_key: '591719147817359',
  api_secret: 'wSs6vL5t6soKomienTmhAN4sX7k'
});

const storage = new CloudinaryStorage({
  cloudinary,
  folder: 'profile_photos', // The name of the folder in cloudinary
  allowedFormats: ['jpg', 'png'],
  filename: function (req, res, cb) {
    cb(null, res.originalname); // The file on cloudinary will have the same name as the original file name
  }
});

module.exports = multer({ storage });