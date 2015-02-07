var
  gulp = require('gulp'),
  clean = require('./build/tasks/clean'),
  content = require('./build/tasks/content'),
  css = require('./build/tasks/css'),
  js = require('./build/tasks/js'),
  icons = require('./build/tasks/icons'),
  humanstxt = require('./build/tasks/humanstxt'),
  serve = require('./build/tasks/serve'),
  deploy = require('./build/tasks/deploy');

gulp.task('default', ['build-dev']);

gulp.task('build-dev', ['content', 'css', 'js', 'icons']);
gulp.task('build-prod', ['content-prod', 'css-prod', 'js-prod', 'icons-prod']);

gulp.task('content', ['clean-content'], content.dev);
gulp.task('content-prod', ['clean-content', 'css-prod', 'js-prod', 'icons-prod', 'humanstxt'], content.prod);

gulp.task('css', ['clean-css'], css.dev);
gulp.task('css-prod', ['clean-css', 'clean-build-metadata'], css.prod);

gulp.task('js', ['clean-js'], js.dev);
gulp.task('js-prod', ['clean-js', 'clean-build-metadata'], js.prod);

gulp.task('icons', ['clean-icons'], icons.dev);
gulp.task('icons-prod', ['clean-icons', 'clean-build-metadata'], icons.prod);

gulp.task('humanstxt', humanstxt);

gulp.task('clean-all', ['clean-build-metadata'], clean.all);
gulp.task('clean-content', clean.content);
gulp.task('clean-css', clean.css);
gulp.task('clean-js', clean.js);
gulp.task('clean-icons', clean.icons);
gulp.task('clean-build-metadata', clean.buildMetadata);

gulp.task('serve', ['build-dev'], serve);
gulp.task('deploy', ['build-prod'], deploy);
