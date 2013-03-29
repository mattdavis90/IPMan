var express = require('express');
var path = require('path');
var ipMan = require('./routes/ipman.js');

var app = express();

app.configure(function () {
  app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
  app.use(express.bodyParser());
  app.use(express.static(path.join(__dirname, 'www')));
});

// app.get('/ipAddresses', ipMan.getIPs);
// app.get('/ipAddresses/:id', ipMan.getIPById);
// app.post('/ipAddresses', ipMan.addIP);
// app.put('/ipAddresses/:id', ipMan.updateIP);
// app.delete('/ipAddresses/:id', ipMan.deleteIP);

// app.get('/subnets', ipMan.getSubnets);
// app.get('/subnets/:id', ipMan.getSubnetById);
// app.post('/subnets', ipMan.addSubnet);
// app.put('/subnets/:id', ipMan.updateSubnet);
// app.delete('/subnets/:id', ipMan.deleteSubnet);
 
app.listen(8080);
console.log('Listening on port 8080...');
