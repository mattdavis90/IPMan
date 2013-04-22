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
        setIndex("ipAddresses", "ipAddress", true, function() {
          setIndex("ipAddresses", "subnet", false, function() {
            setIndex("users", "username", true, function() {
              console.log("Finished Initialising Database");
            });
          });
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

function setIndex(collection, field, unique, callback) {
  db.ensureIndex(collection, field, {"unique": unique}, function(err, index) {
    if(!err) {
      console.log("Successfully set index: " + collection + "::" + field);
      callback();
    } else {
      console.error("Could not set index " + collection + "::" + field + ". Exiting...");
      process.exit(1);
    }
  });
}