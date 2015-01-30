var
  browserSync = require('browser-sync'),
  gulp = require('gulp'),
  runSequence = require('run-sequence'),
  reload = browserSync.reload;

module.exports = function serveTask () {
  browserSync({
    server: {
      baseDir: 'dist'
    }
  });

  gulp.watch('{src/content/**/*,src/templates/**/*}', function () {
    runSequence('content', reload);
  });

  gulp.watch('src/scss/**/*', function () {
    runSequence('css', reload);
  });

  gulp.watch('src/js/**/*', function () {
    runSequence('js', reload);
  });
};
