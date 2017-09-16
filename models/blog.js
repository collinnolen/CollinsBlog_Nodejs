var mongoose = require('mongoose');


var BlogSchema = mongoose.Schema({
  post_id:{
    type: String
  },
  post_author:{
    type: String
  },
  post_img:{
    type: String
  },
  title:{
    data: Buffer, contentType: String
  },
  password:{
    type: String
  }
}, {collection: 'posts'});

var Blog = mongoose.model('Blog', BlogSchema);
