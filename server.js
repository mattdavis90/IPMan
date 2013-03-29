var express = require('express');
var path = require('path');
var ipMan = require('./routes/ipman.js');

var app = express();

app.configure(function () {
  app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
  app.use(express.bodyParser());
  app.use(express.static(path.join(__dirname, 'www')));
});

app.get('/ipAddresses', ipMan.list);
app.get('/ipAddresses/:id', ipMan.byId);
app.post('/ipAddresses', ipMan.add);
// app.put('/ipAddresses/:id', ipMan.update);
// app.delete('/ipAddresses/:id', ipMan.delete);
 
app.listen(8000);
console.log('Listening on port 8000...');
