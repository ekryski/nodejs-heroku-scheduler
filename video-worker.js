var scheduler = require('./scheduler');

function convertFrame(i, fn) {
  setTimeout(fn, Math.random() * 1000);
}

// process video conversion jobs, 1 at a time.
scheduler.on('process:video', function(job, done){
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
  
scheduler.run();