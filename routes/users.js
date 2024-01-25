
const mongoose = require('mongoose');


// Connect to MongoDB
mongoose.connect("mongodb+srv://mahdevap20:kalki2.0@pinglagram.kx0rnbd.mongodb.net/pinglagram" )
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
