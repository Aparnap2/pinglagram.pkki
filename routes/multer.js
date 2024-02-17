

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


require ('dotenv').config(),

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Now you can use Cloudinary with the securely loaded credentials

  

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'pinglagram', // Optional: Specify a folder on Cloudinary
    allowedFormats: ['jpg', 'png', 'jpeg', 'mp4'], // Optional: Restrict allowed file types
  });
  
  const upload = multer({ storage: storage });
  


module.exports = upload

module.exports.cloudinary = cloudinary;

