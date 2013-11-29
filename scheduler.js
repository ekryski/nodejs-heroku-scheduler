var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var url = require('url');
var kue = require('kue');
var redis = require('redis');

if (process.env.REDISTOGO_URL) {
  var rtg = require("url").parse(process.env.REDISTOGO_URL);

  kue.redis.createClient = function() {
    var client = redis.createClient(rtg.port, rtg.hostname);
    client.auth(rtg.auth.split(":")[1]);
    return client;
  };
}

var _emitter = new EventEmitter();
var jobs = kue.createQueue();

var Scheduler = {
  on: function( name, callback, scope ) {
    _emitter.on( name, _.bind( callback, scope ) );
  },

  run: function() {
    console.log('Scheduler Running');

    this.processJob();
      
    // setInterval(_.bind(this.processJob, this), 1000);
  },

  processJob: function(){
    jobs.process('video', 1, function(job, done){
      // Emit event for worker to listen to
      _emitter.emit('process:video', job, done);
    });
  }
};

// Scheduler.prototype.on = function( name, callback, scope ) {
//   this._emitter.on( name, _.bind( callback, scope ) );
// };

// Scheduler.prototype.run = function() {
//   console.log('Scheduler Running');
    
//   setInterval(_.bind(this.processJob, this), 1000);
// };

// Scheduler.prototype.processJob = function(){
//   console.log('Looking for Video Job');
//   var self = this;
//   jobs.process('video', 1, function(job, done){
//     // Emit event for worker to listen to
//     console.log(job, done);
//     self._emitter.emit('process:video', job, done);
//   });
// };

// singleton = singleton || new Scheduler();

exports = module.exports = Scheduler;