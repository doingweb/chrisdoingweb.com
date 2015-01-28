var
  gulp = require('gulp'),
  clean = require('./build/tasks/clean'),
  content = require('./build/tasks/content'),
  css = require('./build/tasks/css'),
  js = require('./build/tasks/js'),
  serve = require('./build/tasks/serve');

gulp.task('default', ['build-dev']);

gulp.task('build-dev', ['content', 'css', 'js']);
gulp.task('build-deploy', ['content-deploy', 'css-deploy', 'js-deploy']);

gulp.task('clean-all', clean.all);
gulp.task('clean-content', clean.content);
gulp.task('clean-css', clean.css);
gulp.task('clean-js', clean.js);
gulp.task('clean-build-metadata', clean.buildMetadata);

gulp.task('content', ['clean-content'], content());
gulp.task('content-deploy', ['clean-content', 'css-deploy', 'js-deploy'], content({ rev: true }));

gulp.task('css', ['clean-css'], css());
gulp.task('css-deploy', ['clean-css', 'clean-build-metadata'], css({ rev: true }));

gulp.task('js', ['clean-js'], js());
gulp.task('js-deploy', ['clean-js', 'clean-build-metadata'], js({ rev: true }));

gulp.task('serve', ['build-dev'], serve);
