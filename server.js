var express = require('express');
var path = require('path');
var ipMan = require('./routes/ipman.js');

var app = express();

app.configure(function () {
  app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
  app.use(express.bodyParser());
  app.use(express.static(path.join(__dirname, 'www')));
});


app.get('/subnets', ipMan.getSubnets);

app.get('/ipAddresses', ipMan.getIPs);
app.get('/availableIPAddresses', ipMan.getAvailableIPs);
app.get('/ipAddresses/:id', ipMan.getSingleIP);
app.post('/ipAddresses', ipMan.addIP);
app.delete('/ipAddresses/:id', ipMan.removeIP);

app.get('/users', ipMan.getUsers);
app.post('/users', ipMan.addUser);
app.put('/users/:id', ipMan.updateUser);
app.delete('/users/:id', ipMan.removeUser);

app.get('/leases', ipMan.getLeases);
app.get('/leases/:id', ipMan.getUsersLeases);
app.post('/leases', ipMan.addLease);
app.delete('/leases/:id', ipMan.removeLease);
 
app.listen(8080);
console.log('Listening on port 8080...');
