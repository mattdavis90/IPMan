var mongo = require('mongodb');
 
var Server = mongo.Server;
var DB = mongo.Db;
var BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new DB('ipMan', server, {safe: true});
 
db.open(function(err, db) {
  if(!err) {
    console.log("Connected to the database");
  }
});
 
exports.getSubnets = function(req, res) {
  db.collection('ipAddresses', function(err, collection) {
    collection.distinct('subnet', function(err, subnets) {
      res.send(subnets);
    });
  });
}

exports.getIPs = function(req, res) {
  db.collection('ipAddresses', function(err, collection) {
    collection.find().toArray(function(err, ips) {
      res.send(ips);
    });
  });
}
exports.getAvailableIPs = function(req, res) {
  db.collection('ipAddresses', function(err, collection) {
    collection.find({'reserved': false}).toArray(function(err, ips) {
      res.send(ips);
    });
  });
}
exports.getSingleIP = function(req, res) {
  var id = req.params.id;

  db.collection('ipAddresses', function(err, collection) {
    collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, ip) {
      res.send(ip);
    });
  });
}
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

 
// exports.byId = function(req, res) {
//   var id = req.params.id;

//   db.collection('ipAddresses', function(err, collection) {
//     collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, address) {
//       res.send(address);
//     });
//   });
// };
 
// exports.updateWine = function(req, res) {
// var id = req.params.id;
// var wine = req.body;
// console.log('Updating wine: ' + id);
// console.log(JSON.stringify(wine));
// db.collection('wines', function(err, collection) {
// collection.update({'_id':new BSON.ObjectID(id)}, wine, {safe:true}, function(err, result) {
// if (err) {
// console.log('Error updating wine: ' + err);
// res.send({'error':'An error has occurred'});
// } else {
// console.log('' + result + ' document(s) updated');
// res.send(wine);
// }
// });
// });
// }