const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://mahdevap20:kalki2.0@pinglagram.kx0rnbd.mongodb.net/pinglagram');

const plm = require("passport-local-mongoose")

const userschema = mongoose.Schema ({

username: String,
name: String,
email: String,
password: String,
profileImage: String,
posts: [{type: mongoose.Schema.Types.ObjectId, ref : 'posts'}]

})


userschema.plugin(plm)



module.exports = mongoose.model("User"  , userschema);