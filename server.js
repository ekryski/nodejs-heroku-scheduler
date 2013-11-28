var kue = require('kue');
var jobs = kue.createQueue();
// var scheduler = require('./scheduler');

var port = process.env.port || 3000;

// scheduler.run();

// start the UI
kue.app.listen(port);
console.log('UI started on port ' + port);