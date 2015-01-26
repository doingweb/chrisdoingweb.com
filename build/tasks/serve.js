var
  browserSync = require('browser-sync'),
  gulp = require('gulp'),
  globs = require('../globs'),
  runSequence = require('run-sequence'),
  reload = browserSync.reload;

module.exports = function serveTask () {
  browserSync({
    server: {
      baseDir: 'dist'
    }
  });

  gulp.watch('{' + globs.content + ',src/templates/**/*}', function () {
    runSequence('content', reload);
  })

  gulp.watch(globs.scss, function () {
    runSequence('css', reload);
  });

  gulp.watch('src/js/**/*', function () {
    runSequence('js', reload);
  });
};
