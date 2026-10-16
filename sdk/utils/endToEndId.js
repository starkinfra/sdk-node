exports.create = function (ispb) {
  var count = 11;
  var _sym = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
  let str = 'E' + ispb + dateTime();

  for (var i = 0; i < count; i++) {
    str += _sym[parseInt(Math.random() * (_sym.length))];
  }

  return str;
}

dateTime = function(){
  var today = new Date();
  var day = ('0' + today.getUTCDate()).slice(-2);
  var month = ('0' + (today.getUTCMonth() + 1)).slice(-2);
  var year = today.getUTCFullYear();
  var hours = ('0' + today.getUTCHours()).slice(-2);
  var minutes = ('0' + today.getUTCMinutes()).slice(-2);

  return (year + month + day + hours + minutes);
}
