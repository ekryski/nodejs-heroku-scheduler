var kue = require('kue');
var jobs = kue.createQueue();
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;

var _emitter = new EventEmitter();

var Scheduler = {
  on: function( name, callback, scope ) {
    _emitter.on( name, _.bind( callback, scope ) );
  },

  run: function() {
    console.log('Scheduler Running');
      
    setInterval(_.bind(this.processJob, this), 1000);
  },

  processJob: function(){
    console.log('Looking for Video Job');
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