/**
 * Includes and connect to DB
 **/
var mongo = require('mongodb');
var config = require('./config').config;
// Get pointers to some useful types
var Server = mongo.Server;
var DB = mongo.Db;
var BSON = mongo.BSONPure;

// Create references to the server and DB
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new DB(config.mongoDB, server, {safe: true});

// Open the database
db.open(function(err, db) {
  if(!err) {
    console.log("Connected to the database");

    db.authenticate(config.mongoUser, config.mongoPwd, function(err, res) {
      if(!err) {
        db.ensureIndex("ipAddresses", ["ipAddress", "subnet"], function(err, index) {
          if(!err) {
            console.log("Successfully set IPAddresses index: " + index);

            db.ensureIndex("users", "username", {"unique": true}, function(err, index) {
              if(!err) {
                console.log("Successfully set Users index: " + index);
              } else {
                console.error("Could not set index. Exiting...");
                process.exit(1);
              }
            });
          } else {
            console.error("Could not set index on IPAddresses. Exiting...");
            process.exit(1);
          }
        });
      } else {
        console.error("Could not authenticate. Exiting...");
        process.exit(1);
      }
    });
  } else {
    console.error("Could not open db. Exiting...");
    process.exit(1);
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