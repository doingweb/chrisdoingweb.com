var
  browserSync = require('browser-sync'),
  paths = require('../paths'),
  gulp = require('gulp'),
  globs = require('../globs'),
  runSequence = require('run-sequence'),
  reload = browserSync.reload;

module.exports = function serveTask () {
  browserSync({
    server: {
      baseDir: paths.build
    }
  });

  gulp.watch('{' + globs.content + ',' + globs.templates + '}', function () {
    runSequence('content', reload);
  })

  gulp.watch(globs.scss, function () {
    runSequence('css', reload);
  });
};
