var
  gulp = require('gulp'),
  clean = require('./build/tasks/clean'),
  content = require('./build/tasks/content'),
  icons = require('./build/tasks/icons'),
  css = require('./build/tasks/css'),
  js = require('./build/tasks/js'),
  humanstxt = require('./build/tasks/humanstxt'),
  serve = require('./build/tasks/serve'),
  deploy = require('./build/tasks/deploy');

gulp.task('default', ['build']);

gulp.task('build', ['content', 'icons', 'css', 'js']);
gulp.task('build-prod', ['build', 'content-prod', 'icons-prod', 'css-prod', 'js-prod', 'humanstxt']);

gulp.task('content', ['clean-content'], content.build);
gulp.task('content-prod', ['content', 'icons-prod', 'css-prod', 'js-prod'], content.prod);

gulp.task('icons', ['clean-icons', 'content'], icons.build);
gulp.task('icons-prod', ['icons'], icons.build);

gulp.task('css', ['clean-css'], css.build);
gulp.task('css-prod', ['css', 'clean-build-metadata'], css.prod);

gulp.task('js', ['clean-js'], js.build);
gulp.task('js-prod', ['js', 'clean-build-metadata'], js.prod);

gulp.task('humanstxt', humanstxt);

gulp.task('clean-all', ['clean-build-metadata'], clean.all);
gulp.task('clean-content', clean.content);
gulp.task('clean-icons', clean.icons);
gulp.task('clean-css', clean.css);
gulp.task('clean-js', clean.js);
gulp.task('clean-build-metadata', clean.buildMetadata);

gulp.task('serve', ['build'], serve);
gulp.task('deploy', ['build-prod'], deploy);
