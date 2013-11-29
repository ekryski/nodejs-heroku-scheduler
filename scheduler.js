var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var url = require('url');
var kue = require('kue');
var redis = require('redis');

if (process.env.REDISTOGO_URL) {
  var rtg = require("url").parse(process.env.REDISTOGO_URL);

  console.log(process.env.REDISTOGO_URL);
    

  kue.redis.createClient = function() {
    var client = redis.createClient(rtg.port, rtg.hostname);
    client.auth(rtg.auth.split(":")[1]);
    return client;
  };
}

function Scheduler(){
  this._emitter = new EventEmitter();
  this.jobs = kue.createQueue();
}

Scheduler.prototype.on = function( name, callback, scope ) {
  this._emitter.on( name, _.bind( callback, scope ) );
};

Scheduler.prototype.run = function() {
  console.log('Scheduler Running');
  
  // this.processJob();
  // setInterval(_.bind(this.processJob, this), 1000);
};

Scheduler.prototype.processJob = function(){
  var self = this;
  this.jobs.process('video', 1, function(job, done){
    // Emit event for worker to listen to
    self._emitter.emit('process:video', job, done);
  });
};

exports = module.exports = new Scheduler();