var
  _ = require('lodash'),
  gulp = require('gulp'),
  sourcemaps = require('gulp-sourcemaps'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  glob = require('glob'),
  minify = require('gulp-minify-css'),
  rev = require('gulp-rev'),
  del = require('del');

function buildTask() {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['bower_components']
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/css'));
}

function prodTask() {
  var cssGlob = 'dist/css/*.css';
  var filesToDelete = glob.sync(cssGlob + '?(.map)');

  return gulp.src(cssGlob)
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(minify())
    .pipe(rev())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/css'))
    .pipe(rev.manifest('rev-manifest-css.json'))
    .pipe(gulp.dest('build/.metadata'))
    .on('end', function() {
      del.sync(filesToDelete);
    });
}

module.exports = {
  build: buildTask,
  prod: prodTask
};
