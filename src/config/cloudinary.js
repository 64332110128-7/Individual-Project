const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: 'dke5lzcwz', 
  api_key: '839525967167623',
  api_secret: process.env.CLOUDINARY_SECRET,
});

module.exports = cloudinary;
