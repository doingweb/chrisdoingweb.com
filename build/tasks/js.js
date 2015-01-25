var
  gulp = require('gulp'),
  paths = require('../paths'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify');

module.exports = {
  jquery: function jQueryJsTask (done) {
    return pipeline(
      gulp.src('bower_components/jquery/dist/jquery.js'),
      'jquery.js');
  },
  foundation: function foundationJsTask (done) {
    return pipeline(
      gulp.src([
        'bower_components/foundation/js/foundation/foundation.js',
        'bower_components/foundation/js/foundation/foundation.topbar.js',
        'src/js/init-foundation.js'
      ]),
      'foundation.js');
  }
};

function pipeline (source, output) {
  return source
    .pipe(sourcemaps.init())
    .pipe(concat(output))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/js'));
}
