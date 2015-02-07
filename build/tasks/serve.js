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

  gulp.watch('src/{content,templates}/**/*', function () {
    runSequence('content', reload);
  });

  gulp.watch('src/scss/**/*', function () {
    runSequence('css', reload);
  });

  gulp.watch('src/js/**/*', function () {
    runSequence('js', reload);
  });

  gulp.watch('src/content/metadata/contact.yaml', ['icons', 'content']);
};
