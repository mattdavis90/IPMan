// Include Mongo and the config file
var crypto = require('crypto');
var mongo = require('mongodb');
var config = require('./routes/config').config;
// Get pointers to some useful types
var Server = mongo.Server;
var DB = mongo.Db;
var BSON = mongo.BSONPure;

// Create references to the server and DB
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new DB(config.mongoDB, server, {safe: true});

/*********************************/
var password = "password";
var name = "Root";
/*********************************/

// Open the database
db.open(function(err, db) {
  if(!err) {
    console.log("Connected to the database");

    db.authenticate(config.mongoUser, config.mongoPwd, function(err, res) {
      if(!err) {
        console.log("Authenticated successfully");

        db.collection("users", function(err, collection) {
          if(!err) {
            console.log("Opened collection successfully");

            var passwordHash = crypto.createHash('sha1');
            passwordHash.update(password);

            var user = {
              "username": "root",
              "password": passwordHash.digest('hex'),
              "name": name,
              "accessLevel": 2
            };

            collection.insert(user, {safe: true}, function(err, result) {
              if(!err) {
                console.log("User created successfully");
                process.exit(1);
              } else {
                console.error("Could not create user.");
                console.error(err);
                console.error("Exiting...");
                process.exit(1);
              }
            });
          } else {
            console.error("Could not open collection. Exiting...");
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