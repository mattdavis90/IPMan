var express = require('express');
var path = require('path');
var ipMan = require('./routes/ipman.js');
var userAuth = require('./routes/userAuth.js');

var app = express();

app.configure(function () {
  app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
  app.use(express.bodyParser());
  app.use(express.static(path.join(__dirname, 'www')));
});

var standardAuth = express.basicAuth(userAuth.verifyStandard);
var rootAuth = express.basicAuth(userAuth.verifyRoot);

app.get('/api/subnets', standardAuth, ipMan.getSubnets);

app.get('/api/ipAddresses', standardAuth, ipMan.getIPs);
app.get('/api/availableIPAddresses', standardAuth, ipMan.getAvailableIPs);
app.get('/api/ipAddresses/:id', standardAuth, ipMan.getSingleIP);
app.post('/api/ipAddresses', rootAuth, ipMan.addIP);
app.delete('/api/ipAddresses/:id', rootAuth, ipMan.removeIP);

app.get('/api/leases', standardAuth, ipMan.getLeases);
app.get('/api/leases/:user', standardAuth, ipMan.getUsersLeases);
app.post('/api/leases/:id', standardAuth, ipMan.addLease);
app.delete('/api/leases/:id', standardAuth, ipMan.removeLease);

app.get('/api/users', standardAuth, ipMan.getUsers);
app.post('/api/users', rootAuth, ipMan.addUser);
app.put('/api/users/:id', standardAuth, ipMan.updateUser);
app.delete('/api/users/:id', rootAuth, ipMan.removeUser);
 
app.listen(8080);
console.log('Listening on port 8080...');
