/**
 * Includes and connect to DB
 **/
var crypto = require('crypto');
var DB = require('../inc/db');
var audit = require('../inc/audit').audit;
// Get pointers to some useful types
var db = DB.getDB();

exports.login = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  if(username && password) {
    var passwordHash = crypto.createHash('sha1');
    passwordHash.update(password);
    password = passwordHash.digest('hex');

    db.collection('users', function(err, collection) {
      collection.findOne({username: username, password: password}, function(err, user) {
        if(user) {
          req.session.user = {
            id: user._id,
            username: user.username,
            name: user.name,
            accessLevel: user.accessLevel
          };

          res.send(req.session.user);
          audit(user.username, user.name + " Successfully Logged In");
        } else {
          res.send({"error": "Incorrect username or password"});
          audit(username, "Incorrect Username or Password");
        }
      });
    });
  } else {
    res.send({"error": "You must specify both a username and password"});
  }
}

exports.logout = function(req, res) {
  var user = req.session.user;

  delete req.session.user;

  res.send({"ok": true});

  audit(user.username, user.name + " Successfully Logged Out");
}

exports.session = function(req, res) {
  if(req.session.user) {
    res.send(req.session.user);
  } else {
    res.send({});
  }
}

exports.checkStandard = function(req, res, next) {
  var user = req.session.user;

  if(user) {
    next();
  } else {
    res.send(401, {"error": "You must be logged in to access this resource"});
    audit("", "Attempted access to restricted resource");
  }
}

exports.checkRoot = function(req, res, next) {
  var user = req.session.user;

  if(user) {
    if(user.username == "root") {
      next();
    } else {
      res.send(403, {"error": "You do not have access to this resource"});
      audit(user.username, user.name + " attempted to access a 'root' resource");
    }
  } else {
    res.send(401, {"error": "You must be logged in to access this resource"});
    audit("", "Attempted access to restricted 'root' resource");
  }
}
