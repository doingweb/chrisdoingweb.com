var
  gulp = require('gulp'),
  globs = require('../globs'),
  sourcemaps = require('gulp-sourcemaps'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-minify-css');

module.exports = function cssTask () {
  return gulp.src(globs.scss)
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['bower_components']
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(minifycss())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/css'));
};
