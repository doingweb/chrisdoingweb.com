var
  _ = require('lodash'),
  gulp = require('gulp'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  glob = require('glob'),
  uglify = require('gulp-uglify'),
  merge = require('merge-stream'),
  rev = require('gulp-rev'),
  del = require('del');

function buildTask() {
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

  return merge(jqueryPipeline, bundlePipeline)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/js'));
}

function prodTask() {
  var jsGlob = 'dist/js/*.js';
  var filesToDelete = glob.sync(jsGlob + '?(.map)');

  return gulp.src(jsGlob)
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(rev())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rev.manifest('rev-manifest-js.json'))
    .pipe(gulp.dest('build/.metadata'))
    .on('end', function() {
      del.sync(filesToDelete);
    });
}

function pipeline (source, output) {
  return source
    .pipe(sourcemaps.init())
    .pipe(concat({path: output, cwd: ''}));
}

module.exports = {
  build: buildTask,
  prod: prodTask
};
