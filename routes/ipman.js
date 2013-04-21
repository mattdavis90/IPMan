/**
 * Includes and connect to DB
 **/
var crypto = require('crypto');
var DB = require('./db');
// Get pointers to some useful types
var db = DB.getDB();
var BSON = DB.getBSON();

/**
 * getSubnets()
 * Finds all the subnets mentioned in the ipAddresses collection
 **/
exports.getSubnets = function(req, res) {
  db.collection('ipAddresses', function(err, collection) {
    collection.distinct('subnet', function(err, subnets) {
      res.send({subnets: subnets});
    });
  });
}
/**
 * removeSubnet()
 * Remove the specified subnet
 **/
exports.removeSubnet = function(req, res) {
  var subnet = req.params.subnet;

  db.collection('ipAddresses', function(err, collection) {
    collection.remove({'subnet': subnet}, {safe: true}, function(err, result) {
      if(err) {
        res.send({'error': err});
      } else {
        res.send({});
      }
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
      ips = sortIPs(ips);

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
      ips = sortIPs(ips);

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
        res.send({});
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
        res.send({});
      }
    });
  });
}

/**
 * getLeases()
 * Get all the leases (for the current user if not root)
 **/
exports.getLeases = function(req, res) {
  var username = req.session.user.username;
  var search = {
    'reserved': true
  }

  if(username != 'root') {
    search['reservedBy'] = username;
  }

  db.collection('ipAddresses', function(err, collection) {
    collection.find(search).toArray(function(err, leases) {
      leases = sortIPs(leases);
      
      res.send(leases);
    });
  });
}
/**
 * addLease()
 * Add a lease to a certain IP Address
 **/
exports.addLease = function(req, res) {
  var id = req.body.id;
  var username = req.session.user.username;
  var lease = req.body;

  delete(lease.id);
  lease['reserved'] = true;
  lease['reservedBy'] = username;

  if(lease.reservedBy && lease.location && lease.hostname && lease.machineType) {
    db.collection('ipAddresses', function(err, collection) {
      collection.update({'_id': BSON.ObjectID(id)}, {$set:lease}, {safe: true}, function(err, result){
        if(err) {
          res.send({'error': err});
        } else {
          res.send({});
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
  var username = req.session.user.username;
  var lease = {
    "reservedBy": "",
    "location": "",
    "hostname": "",
    "machineType" :""
  };
  var search = {
    '_id': BSON.ObjectID(id)
  };

  if(username != 'root') {
    search['reservedBy'] = username;
  }

  db.collection('ipAddresses', function(err, collection) {
    collection.update(search, {$set: {"reserved": false}, $unset:lease}, {safe: true}, function(err, result) {
      if(err) {
        res.send({'error': err});
      } else {
        res.send({});
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
    collection.find({"username": {$ne: "root"}}).toArray(function(err, users) {
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
    var passwordHash = crypto.createHash('sha1');
    passwordHash.update(password);

    var user = {
      "username": username,
      "password": passwordHash.digest('hex'),
      "name": name,
      "accessLevel": 1
    };

    db.collection('users', function(err, collection) {
      collection.insert(user, {safe: true}, function(err, result) {
        if(err) {
          res.send({'error': 'User already exists'});
        } else {
          res.send({});
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
  var id = req.session.user.id;
  var password = req.body.password;
  var name = req.body.name;

  if(name) {
    var user = {
      "name": name
    }

    if(password) {
      var passwordHash = crypto.createHash('sha1');
      passwordHash.update(password);

      user["password"] = passwordHash.digest('hex');
    }

    db.collection('users', function(err, collection) {
      collection.update({'_id': BSON.ObjectID(id)}, {$set:user}, {safe: true}, function(err, result) {
        if(err) {
          res.send({'error': err});
        } else {
          req.session.user.name = name;

          res.send({});
        }
      });
    });
  } else {
    res.send({"error": "You must specify a name"});
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
        res.send({});
      }
    });
  });
}

function sortIPs(ips) {
  ips.sort(function(a, b) {
    var aParts = a.ipAddress.split(".");
    var bParts = b.ipAddress.split(".");

    if(aParts[0] == bParts[0]) {
      if(aParts[1] == bParts[1]) {
        if(aParts[2] == bParts[2]) {
          return aParts[3] - bParts[3];
        } else {
          return aParts[2] - bParts[2];
        }
      } else {
        return aParts[1] - bParts[1];
      }
    } else {
      return aParts[0] - bParts[0];
    }
  });

  return ips;
}
