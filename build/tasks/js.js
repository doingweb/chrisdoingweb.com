var
  gulp = require('gulp'),
  sourcemaps = require('gulp-sourcemaps'),
  modernizr = require('gulp-modernizr'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify');

module.exports = {
  modernizr: function modernizrJsTask () {
    return gulp.src([
        'src/scss/**/*.scss',
        'src/js/**/*.js'
      ])
      .pipe(modernizr())
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('dist/js'));
  },
  jquery: function jQueryJsTask () {
    return pipeline(
      'bower_components/jquery/dist/jquery.js',
      'jquery.js');
  },
  foundation: function foundationJsTask () {
    return pipeline(
      [
        'bower_components/foundation/js/foundation/foundation.js',
        'bower_components/foundation/js/foundation/foundation.topbar.js',
        'src/js/init-foundation.js'
      ],
      'foundation.js');
  }
};

function pipeline (source, output) {
  return gulp.src(source)
    .pipe(sourcemaps.init())
    .pipe(concat(output))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/js'));
}
