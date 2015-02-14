var
  _ = require('lodash'),
  gulp = require('gulp'),
  sourcemaps = require('gulp-sourcemaps'),
  modernizr = require('gulp-modernizr'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  merge = require('merge-stream'),
  rev = require('gulp-rev');

module.exports = {
  dev: function () { return jsTask(); },
  prod: function () { return jsTask(true); }
};

function jsTask (prod) {
  var modernizrPipeline = pipeline(gulp.src([
      'src/scss/**/*.scss',
      'src/js/**/*.js'
    ]).pipe(modernizr()),
    'modernizr.js');
  var jqueryPipeline = pipeline(gulp.src(
      'bower_components/jquery/dist/jquery.js'
    ),
    'jquery.js');
  var bundlePipeline = pipeline(gulp.src([
      'bower_components/svg4everybody/svg4everybody.js',
      'bower_components/foundation/js/foundation/foundation.js',
      'bower_components/foundation/js/foundation/foundation.topbar.js',
      'src/js/init-foundation.js'
    ]),
    'bundle.js');

  var mergedPipeline = merge(modernizrPipeline, jqueryPipeline, bundlePipeline);

  if (prod) {
    mergedPipeline = mergedPipeline.pipe(rev());
  }

  var outputJs = mergedPipeline
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/js'));

  if (prod) {
    return outputJs
      .pipe(rev.manifest('rev-manifest-js.json'))
      .pipe(gulp.dest('build/.metadata'));
  }

  return outputJs;
}

function pipeline (source, output) {
  return source
    .pipe(sourcemaps.init())
    .pipe(concat({path: output, cwd: ''}))
    .pipe(uglify());
}
