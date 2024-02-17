
const mongoose = require('mongoose');

require('dotenv').config();
// Connect to MongoDB
mongoose.connect(process.env.mongodb_url )
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


const plm = require('passport-local-mongoose');

const userschema = mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  profileImage: String,
  bio: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'posts' }]
});

userschema.plugin(plm);

module.exports = mongoose.model('user', userschema);
