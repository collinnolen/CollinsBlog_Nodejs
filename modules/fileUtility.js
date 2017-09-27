module.exports.pageNumberJsonBuilder = function(number){
  var array ={count:[]};
  for(var i=0; i<number; i++){
    array.count.push(i+1);
  }
  return array;
}
