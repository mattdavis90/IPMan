var express = require('express');
var path = require('path');
var ipMan = require('./routes/ipman.js');
var auth = require('./routes/auth.js');

var app = express();
var store = new express.session.MemoryStore;

app.configure(function () {
  app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
  app.use(express.bodyParser());
  app.use(express.static(path.join(__dirname, 'www')));
  app.use(express.cookieParser());
  app.use(express.session({secret: 'secret', store: store, key: 'test'}));
});

app.post('/api/login', auth.login);
app.get('/api/logout', auth.logout);
app.get('/api/session', auth.session);

app.get('/api/subnets', auth.checkStandard, ipMan.getSubnets);

app.get('/api/ipAddresses', auth.checkStandard, ipMan.getIPs);
app.get('/api/availableIPAddresses', auth.checkStandard, ipMan.getAvailableIPs);
app.get('/api/ipAddresses/:id', auth.checkStandard, ipMan.getSingleIP);
app.post('/api/ipAddresses', auth.checkRoot, ipMan.addIP);
app.delete('/api/ipAddresses/:id', auth.checkRoot, ipMan.removeIP);

app.get('/api/leases', auth.checkStandard, ipMan.getLeases);
app.post('/api/leases', auth.checkStandard, ipMan.addLease);
app.delete('/api/leases/:id', auth.checkStandard, ipMan.removeLease);

app.get('/api/users', auth.checkRoot, ipMan.getUsers);
app.post('/api/users', auth.checkRoot, ipMan.addUser);
app.put('/api/users', auth.checkStandard, ipMan.updateUser);
app.delete('/api/users/:id', auth.checkRoot, ipMan.removeUser);
 
app.listen(8080);
console.log('Listening on port 8080...');
