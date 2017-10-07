const fs = require('fs');
const mongoose = require('mongoose');
const gridfs = require('gridfs-stream');
var conn = mongoose.createConnection(process.env.DATABASE_URL, {useMongoClient:true})

const db = mongoose.connection;

module.exports.writeFileToServer = function(file, username, id, type, callback){
  let filename = type + '-' + username + '-' + id + '.' +(file.name.split('.'))[1];
  file.mv('uploadFiles/' + filename, function(err){
      if (err) callback(err, null);
      else callback(null, filename);
  });
}

module.exports.writeImageToDb = function(filename, username, postid, callback){
  fs.readdir('uploadFiles', (err, files) =>{
      if(err) return handleError(err);
      var gfs = gridfs(conn.db, mongoose.mongo);
      var fileToUpload;

      files.forEach(function(element){
        if(element === filename)
          fileToUpload = element;
      })

      var writestream = gfs.createWriteStream({
        filename: fileToUpload,
        metadata: {
          username: username,
          postid: postid
        }
      });
      fs.createReadStream('uploadFiles/'+ fileToUpload).pipe(writestream);

      writestream.on('finish', function(err){
        console.log('finish '+ fileToUpload);
        if(err) callback(err, fileToUpload);
        else callback(null, fileToUpload);
      })
  });//end fs.readdir
}

module.exports.fetchImageReadStreamByPostId = function(post_id, callback){
  var gfs = gridfs(conn.db, mongoose.mongo);

  gfs.findOne({'metadata.postid': post_id}, function(err, data){
    if(err) callback(err);
    else{
      if(data === null)
        callback(null, null, null);
      else{
        var readstream = gfs.createReadStream({
          _id:data._id
        });
        callback(null, data, readstream);
      }
    }
  })
}
