var express = require('express');
var app = express();

app.get('/', function(req, res) {
  // We must end the request when we are done handling it
  res.end();
});

app.listen(8000, () => {
  console.log('Server started!');
});

module.exports = app;
