// var scheduler = require('./scheduler');
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

var jobs = kue.createQueue();

function convertFrame(i, fn) {
  setTimeout(fn, Math.random() * 1000);
}

// process video conversion jobs, 1 at a time.
jobs.process('video', 1, function(job, done){
  console.log('Processing Video');
  var frames = job.data.frames;

  function next(i) {
    // pretend we are doing some work
    convertFrame(i, function(err){
      if (err) return done(err);

      // report progress, i/frames complete
      job.progress(i, frames);
      
      if (i >= frames) return done();
      
      next(i + Math.random() * 10);
    });
  }

  next(0);
});

console.log('Video Worker Running');