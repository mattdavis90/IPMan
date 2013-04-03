// TODO: Look at a config.js file to determine whether to use LDAP for user auth
// TODO: Use the database to authenticate users

/**
 * Includes and connect to DB
 **/
var DB = require('./db');
// Get pointers to some useful types
var db = DB.getDB();

/**
 * Will verify a standard user
 **/
exports.verifyStandard = function(username, password, callback) {
  var result = true;
  var error = null;

  callback(error, result);
}

/**
 * Will verify the root user
 **/
exports.verifyRoot = function(username, password, callback) {
  var result = (username === "root");
  var error = null;

  callback(error, result);
}