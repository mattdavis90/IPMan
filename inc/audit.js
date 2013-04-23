/**
 * Includes and connect to DB
 **/
var DB = require('./db');
// Get pointers to some useful types
var db = DB.getDB();


exports.audit = function(username, message) {
  var date = new Date();
  var dateString = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  var timeString = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

  var audit = {
    date    : (timeString + " " + dateString),
    username: username,
    message : message
  };

  db.collection('audit', function(err, collection) {
    collection.insert(audit, {safe: true}, function(err, result) {});
  });
}
