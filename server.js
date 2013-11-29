var url = require('url');
var kue = require('kue');
var redis = require('redis');
var scheduler = require('./scheduler');

var port = process.env.PORT || 3000;

scheduler.run();

// start the UI
kue.app.listen(port);
console.log('UI started on port ' + port);