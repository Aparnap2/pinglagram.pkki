
const {v4: uuidv4} = require ('uuid');

const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name: 'dxoqzy5lt',
    api_key: '824271955762284',
    api_secret: 'wlCv2qsaRbktqS3JqKp-AaYeCL0'
  });

  

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'pinglagram', // Optional: Specify a folder on Cloudinary
    allowedFormats: ['jpg', 'png', 'jpeg'], // Optional: Restrict allowed file types
  });
  
  const upload = multer({ storage: storage });
  


module.exports = upload


