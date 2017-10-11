module.exports.arrayHasObject = function(array, object){
  array.forEach(function(element){
    if(element === object)
      return true; //object found
  });
  return false; // object not found
}
