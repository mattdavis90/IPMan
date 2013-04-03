var express = require('express');
var path = require('path');
var ipMan = require('./routes/ipman.js');

var app = express();

app.configure(function () {
  app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
  app.use(express.bodyParser());
  app.use(express.static(path.join(__dirname, 'www')));
});


app.get('/api/subnets', ipMan.getSubnets);

app.get('/api/ipAddresses', ipMan.getIPs);
app.get('/api/availableIPAddresses', ipMan.getAvailableIPs);
app.get('/api/ipAddresses/:id', ipMan.getSingleIP);
app.post('/api/ipAddresses', ipMan.addIP);
app.delete('/api/ipAddresses/:id', ipMan.removeIP);

app.get('/api/leases', ipMan.getLeases);
app.get('/api/leases/:user', ipMan.getUsersLeases);
app.post('/api/leases/:id', ipMan.addLease);
app.delete('/api/leases/:id', ipMan.removeLease);

app.get('/api/users', ipMan.getUsers);
app.post('/api/users', ipMan.addUser);
app.put('/api/users/:id', ipMan.updateUser);
app.delete('/api/users/:id', ipMan.removeUser);
 
app.listen(8080);
console.log('Listening on port 8080...');
