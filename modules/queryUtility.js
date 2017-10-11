module.exports.redirectEncodeQueryBuilder = function(unEncodedUrl){
  if(unEncodedUrl === '/logout')
    return '';


  var returnString = unEncodedUrl;
  returnString = returnString.replace(/\//g, '-');
  returnString = returnString.replace(/\?/g, '.');
  returnString = returnString.replace(/=/g, '_');
  returnString = returnString.replace(/&/g, '~');
  returnString = '?redirect=' + returnString;

  return returnString;
}

module.exports.redirectDecodeQueryBuilder = function(encodedUrl){
  var returnString = encodedUrl;
  returnString = returnString.replace(/-/g, '/');
  returnString = returnString.replace(/\./g, '?');
  returnString = returnString.replace(/_/g, '=');
  returnString = returnString.replace(/~/g, '&');

  return returnString;
}
