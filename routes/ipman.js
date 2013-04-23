/**
 * Includes and connect to DB
 **/
var crypto = require('crypto');
var DB = require('../inc/db');
var audit = require('../inc/audit').audit;
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

      audit(req.session.user.username, req.session.user.name + " listed all subnets");
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

        audit(req.session.user.username, req.session.user.name + " removed a subnet (" + subnet + ")");
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

      audit(req.session.user.username, req.session.user.name + " listed all IP addresses");
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

      audit(req.session.user.username, req.session.user.name + " listed all available IP addresses");
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

      audit(req.session.user.username, req.session.user.name + " got a single IP address (" + ip.ipAddress + ")");
    });
  });
}
/**
 * getIP()
 * Adds one or more IPs to the ipAddresses collection
 **/
exports.addIP = function(req, res) {
  var ipAddress = req.body;

  db.collection('ipAddresses', function(err, collection) {
    collection.insert(ipAddress, {safe: true}, function(err, result) {
      if(err) {
        res.send({'error': err});
      } else {
        res.send({});

        audit(req.session.user.username, req.session.user.name + " added an IP Address (" + ipAddress.ipAddress + ")");
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

        audit(req.session.user.username, req.session.user.name + " removed an IP Address (" + result.ipAddress + ")");
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

      audit(req.session.user.username, req.session.user.name + " listed all leases");
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
          console.log(result);
          audit(req.session.user.username, req.session.user.name + " added a lease (" + lease.hostname + ")");
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

        audit(req.session.user.username, req.session.user.name + " removed a lease");
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

      audit(req.session.user.username, req.session.user.name + " listed all users");
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

          audit(req.session.user.username, req.session.user.name + " added a user (" + username + ")");
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

          audit(req.session.user.username, req.session.user.name + " changed there account details");
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

        audit(req.session.user.username, req.session.user.name + " removed a user");
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
