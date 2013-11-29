var url = require('url');
var kue = require('kue');
var redis = require('redis');

var port = process.env.port || 3000;

if (process.env.REDISTOGO_URL) {
  var rtg = require("url").parse(process.env.REDISTOGO_URL);

  kue.redis.createClient = function() {
    var client = redis.createClient(rtg.port, rtg.hostname);
    client.auth(rtg.auth.split(":")[1]);
    return client;
  };
}
// var scheduler = require('./scheduler');



// scheduler.run();

// start the UI
kue.app.listen(port);
console.log('UI started on port ' + port);