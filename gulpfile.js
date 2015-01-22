var
  gulp = require('gulp'),
  clean = require('./build/tasks/clean'),
  content = require('./build/tasks/content'),
  css = require('./build/tasks/css'),
  serve = require('./build/tasks/serve');

gulp.task('default', ['content', 'css']);

gulp.task('clean-all', clean.all);
gulp.task('clean-content', clean.content);
gulp.task('clean-css', clean.css);

gulp.task('content', ['clean-content'], content);
gulp.task('css', ['clean-css'], css);

gulp.task('serve', ['default'], serve);
