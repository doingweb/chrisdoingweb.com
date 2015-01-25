var
  gulp = require('gulp'),
  clean = require('./build/tasks/clean'),
  content = require('./build/tasks/content'),
  css = require('./build/tasks/css'),
  js = require('./build/tasks/js'),
  serve = require('./build/tasks/serve');

gulp.task('default', ['content', 'css', 'js']);

gulp.task('clean-all', clean.all);
gulp.task('clean-content', clean.content);
gulp.task('clean-css', clean.css);
gulp.task('clean-js', clean.js);

gulp.task('content', ['clean-content'], content);

gulp.task('css', ['clean-css'], css);

gulp.task('js', ['js-jquery', 'js-foundation']);
gulp.task('js-jquery', ['clean-js'], js.jquery);
gulp.task('js-foundation', ['clean-js'], js.foundation);

gulp.task('serve', ['default'], serve);
