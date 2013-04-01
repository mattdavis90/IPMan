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
 * getSubnets()
 * Finds all the subnets mentioned in the ipAddresses collection
 **/
exports.getSubnets = function(req, res) {
  db.collection('ipAddresses', function(err, collection) {
    collection.distinct('subnet', function(err, subnets) {
      res.send(subnets);
    });
  });
}

/**
 * getIPs()
 * Finds all the IPs in the ipAddresses collection
 **/
exports.getIPs = function(req, res) {
  db.collection('ipAddresses', function(err, collection) {
    collection.find().toArray(function(err, ips) {
      res.send(ips);
    });
  });
}
/**
 * getAvailableIPs()
 * Finds all the IPs in the ipAddresses collection with no reservation
 **/
exports.getAvailableIPs = function(req, res) {
  db.collection('ipAddresses', function(err, collection) {
    collection.find({'reserved': false}).toArray(function(err, ips) {
      res.send(ips);
    });
  });
}
/**
 * getSingleIP()
 * Finds the IP in the ipAddresses collection with the given ID
 **/
exports.getSingleIP = function(req, res) {
  var id = req.params.id;

  db.collection('ipAddresses', function(err, collection) {
    collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, ip) {
      res.send(ip);
    });
  });
}
/**
 * getIP()
 * Adds one or more IPs to the ipAddresses collection
 **/
exports.addIP = function(req, res) {
  var ipAddresses = req.body;

  db.collection('ipAddresses', function(err, collection) {
    collection.insert(ipAddresses, {safe: true}, function(err, result) {
      if(err) {
        res.send({'error': err});
      } else {
        res.send(result[0]);
      }
    });
  });
}
/**
 * removeIP()
 * Removes an IP from the ipAddresses collection
 **/
exports.removeIP = function(req, res) {
  var id = req.params.id;

  db.collection('ipAddresses', function(err, collection) {
    collection.remove({'_id': BSON.ObjectID(id)}, {safe: true}, function(err, result) {
      if(err) {
        res.send({'error': err});
      } else {
        res.send(req.body);
      }
    });
  });
}

exports.getUsers = function(req, res) {
  res.send('ok');
}
exports.addUser = function(req, res) {
  res.send('ok');
}
exports.updateUser = function(req, res) {
  res.send('ok');
}
exports.removeUser = function(req, res) {
  res.send('ok');
}

exports.getLeases = function(req, res) {
  res.send('ok');
}
exports.getUsersLeases = function(req, res) {
  res.send('ok');
}
exports.addLease = function(req, res) {
  res.send('ok');
}
exports.removeLease = function(req, res) {
  res.send('ok');
}
