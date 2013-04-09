// TODO: Look at a config.js file to determine whether to use LDAP for user auth
// TODO: Use the database to authenticate users

/**
 * Includes and connect to DB
 **/
var DB = require('./db');
// Get pointers to some useful types
var db = DB.getDB();

exports.login = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  if(username && password) {
    if(password == "password") {
      req.session.user = {
        userId: 0,
        username: username,
        name: "fullname here",
        accessLevel: (username == "root" ? 2 : 1)
      };
      res.send(req.session.user);
    } else {
      res.send({"error": "Incorrect username or password"});
    }
  } else {
    res.send({"error": "You must specify both a username and password"});
  }
}

exports.logout = function(req, res) {
  delete req.session.user;
  res.send({"ok": true});
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
  }
}

exports.checkRoot = function(req, res, next) {
  var user = req.session.user;

  if(user) {
    if(user.username == "root") {
      next();
    } else {
      res.send(403, {"error": "You do not have access to this resource"});
    }
  } else {
    res.send(401, {"error": "You must be logged in to access this resource"});
  }
}
