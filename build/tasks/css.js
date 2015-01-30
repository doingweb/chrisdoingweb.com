var
  _ = require('lodash'),
  gulp = require('gulp'),
  sourcemaps = require('gulp-sourcemaps'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-minify-css'),
  rev = require('gulp-rev');

module.exports = {
  dev: function () { return cssTask(); },
  prod: function () { return cssTask(true); }
};

function cssTask (prod) {
  var css = gulp.src('src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['bower_components']
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(minifycss());

  if (prod) {
    css = css.pipe(rev());
  }

  var outputCss = css
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/css'));

  if (prod) {
    return outputCss
      .pipe(rev.manifest('rev-manifest-css.json'))
      .pipe(gulp.dest('build/.metadata'));
  }

  return outputCss;
}
