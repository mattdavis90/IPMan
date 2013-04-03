/**
 * Includes and connect to DB
 **/
var mongo = require('mongodb');
// Get pointers to some useful types
var Server = mongo.Server;
var DB = mongo.Db;
var BSON = mongo.BSONPure;

// Create references to the server and DB
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new DB('ipMan', server, {safe: true});

// Open the database
db.open(function(err, db) {
  if(!err) {
    console.log("Connected to the database");
  }
});

/**
 * Exposes the database variable
 **/
exports.getDB = function() {
  return db;
}

/**
 * Exposes the BSON type
 **/
exports.getBSON = function() {
  return BSON;
}