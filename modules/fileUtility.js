const fs = require('fs');

module.exports.pageNumberJsonBuilder = function(number){
  var array ={count:[]};
  for(var i=0; i<number; i++){
    array.count.push(i+1);
  }
  return array;
}

module.exports.cleanUploadFiles = function(filename, callback){
  fs.unlink('uploadFiles/' + filename, (err)=>{
      if(err) callback(err);
      else callback(null);
    });
}
