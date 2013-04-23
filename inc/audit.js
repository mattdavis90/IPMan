/**
 * Includes and connect to DB
 **/
var DB = require('./db');
// Get pointers to some useful types
var db = DB.getDB();


exports.audit = function(username, message) {
  var date = new Date();
  var dateString = pad(date.getDate(), 2) + "/" + pad(date.getMonth() + 1, 2) + "/" + pad(date.getFullYear(), 2);
  var timeString = pad(date.getHours(), 2) + ":" + pad(date.getMinutes(), 2) + ":" + pad(date.getSeconds(), 2);

  var audit = {
    date    : (timeString + " " + dateString),
    username: username,
    message : message
  };

  db.collection('audit', function(err, collection) {
    collection.insert(audit, {safe: true}, function(err, result) {});
  });
}

var pad = function(num, pad) {
  if(typeof num === 'number') {
    num = num.toString();
  }

  while(num.length < pad) {
    num = "0" + num;
  }

  return num;
}
