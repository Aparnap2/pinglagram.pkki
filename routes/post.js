
const mongoose = require('mongoose');



 




const postschema =  new mongoose.Schema({
  picture : String,
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  caption : String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'posts' }],





likes : [{
    type: mongoose.Schema.Types.ObjectId,
    ref:   "user"
}],

createdAt: { type: Date, default: Date.now }
});



module.exports = mongoose.model('posts', postschema);
