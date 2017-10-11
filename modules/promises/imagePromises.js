const Image = require('../../models/image.js');

module.exports = {

  fetchImageReadStreamByPostId: function(post_id){
    return new Promise(function(resolve, reject){
      Image.fetchImageReadStreamByPostId(post_id, function(err, _data, _readstream){
        if(err) reject(err);
        else resolve([_data,_readstream]);
      })
    })
  }

}
