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
        res.send(result);
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
        res.send(result);
      }
    });
  });
}

/**
 * getLeases()
 * Get all the IP Addresses that are reserved
 **/
exports.getLeases = function(req, res) {
  db.collection('ipAddresses', function(err, collection) {
    collection.find({'reserved': true}).toArray(function(err, leases) {
      res.send(leases);
    });
  });
}
/**
 * getUsersLeases()
 * Get all the IP Addresses that are reserved by a particular user
 **/
exports.getUsersLeases = function(req, res) {
  var user = req.params.user;

  db.collection('ipAddresses', function(err, collection) {
    collection.find({'reservedBy': user}).toArray(function(err, leases) {
      res.send(leases);
    });
  });
}
/**
 * addLease()
 * Add a lease to a certain IP Address
 **/
exports.addLease = function(req, res) {
  var id = req.params.id;
  var lease = req.body;
  lease['reserved'] = true;

  if(lease.reservedBy && lease.location && lease.hostname && lease.machineType) {
    db.collection('ipAddresses', function(err, collection) {
      collection.update({'_id': BSON.ObjectID(id)}, {$set:lease}, {safe: true}, function(err, result){
        if(err) {
          res.send({'error': err});
        } else {
          res.send(result);
        }
      });
    });
  } else {
    res.send({"error": "You must specify all the reservation details"});
  }
}
/**
 * removeLease()
 * Remove a lease from an IP Address
 **/
exports.removeLease = function(req, res) {
  var id = req.params.id;
  var lease = {
    "reservedBy": "",
    "location": "",
    "hostname": "",
    "machineType" :""
  };

  db.collection('ipAddresses', function(err, collection) {
    collection.update({'_id': BSON.ObjectID(id)}, {$set: {"reserved": false}, $unset:lease}, {safe: true}, function(err, result) {
      if(err) {
        res.send({'error': err});
      } else {
        res.send(result);
      }
    });
  });
}

/**
 * getUsers()
 * Get all the users
 **/
exports.getUsers = function(req, res) {
  db.collection('users', function(err, collection) {
    collection.find().toArray(function(err, users) {
      res.send(users);
    });
  });
}
/**
 * addUser()
 * Add a new user
 **/
exports.addUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var name = req.body.name;

  if(username && password && name) {
    var user = {
      "username": username,
      "password": password,     // TODO: Fix this sha1(password)
      "name": name,
      "accountType": "Standard"
    };

    db.collection('users', function(err, collection) {
      collection.insert(user, {safe: true}, function(err, result) {
        if(err) {
          res.send({'error': err});
        } else {
          res.send(result);
        }
      });
    });
  } else {
    res.send({"error": "You must specify all the user details"});
  }
}
/**
 * updateUser()
 * Update a user's password and name
 **/
exports.updateUser = function(req, res) {
  var id = req.params.id;
  var password = req.body.password;
  var name = req.body.name;

  if(password && name) {
    var user = {
      "password": password,       // TODO: Fix this sha1(password)
      "name": name
    }

    db.collection('users', function(err, collection) {
      collection.update({'_id': BSON.ObjectID(id)}, {$set:user}, {safe: true}, function(err, result) {
        if(err) {
          res.send({'error': err});
        } else {
          res.send(result);
        }
      });
    });
  } else {
    res.send({"error": "You must specify all the user details"});
  }
}
/**
 * removeUser()
 * Remove a user
 **/
exports.removeUser = function(req, res) {
  var id = req.params.id;

  db.collection('users', function(err, collection) {
    collection.remove({'_id': BSON.ObjectID(id)}, {safe: true}, function(err, result) {
      if(err) {
        res.send({'error': err});
      } else {
        res.send(result);
      }
    });
  });
}
