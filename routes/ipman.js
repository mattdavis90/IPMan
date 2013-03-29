var mongo = require('mongodb');
 
var Server = mongo.Server;
var DB = mongo.Db;
var BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new DB('ipDB', server, {safe: true});
 
db.open(function(err, db) {
  if(!err) {
    console.log("Connected to the database");

    db.collection('ipAddresses', {safe:true}, function(err, collection) {
      if(!err) {
        console.log("Successfully opened the collection");
      }
    });
  }
});
 
exports.list = function(req, res) {
  db.collection('ipAddresses', function(err, collection) {
    collection.find().toArray(function(err, addresses) {
      res.send(addresses);
    });
  });
};
 
exports.byId = function(req, res) {
  var id = req.params.id;

  db.collection('ipAddresses', function(err, collection) {
    collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, address) {
      res.send(address);
    });
  });
};
 
exports.add = function(req, res) {
  var ipAddress = req.body;
  
  db.collection('ipAddresses', function(err, collection) {
    collection.insert(ipAddress, {safe:true}, function(err, result) {
      if(err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(result[0]);
      }
    });
  });
}
 
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
 
// exports.deleteWine = function(req, res) {
// var id = req.params.id;
// console.log('Deleting wine: ' + id);
// db.collection('wines', function(err, collection) {
// collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
// if (err) {
// res.send({'error':'An error has occurred - ' + err});
// } else {
// console.log('' + result + ' document(s) deleted');
// res.send(req.body);
// }
// });
// });
// }