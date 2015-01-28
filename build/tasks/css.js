var
  _ = require('lodash'),
  gulp = require('gulp'),
  globs = require('../globs'),
  sourcemaps = require('gulp-sourcemaps'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-minify-css'),
  rev = require('gulp-rev');

module.exports = {
  dev: function () { return cssTask(); },
  deploy: function () { return cssTask(true); }
};

function cssTask (deploy) {
  var css = gulp.src(globs.scss)
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['bower_components']
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(minifycss());

  if (deploy) {
    css = css.pipe(rev());
  }

  var outputCss = css
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/css'));

  if (deploy) {
    return outputCss
      .pipe(rev.manifest('rev-manifest-css.json'))
      .pipe(gulp.dest('build/.metadata'));
  }

  return outputCss;
}
