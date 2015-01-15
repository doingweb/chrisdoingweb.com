'use strict';

var
  gulp = require('gulp'),
  debug = require('gulp-debug'),
  del = require('del'),
  gulpsmith = require('gulpsmith'),
  drafts = require('metalsmith-drafts'),
  markdown = require('metalsmith-markdown'),
  buildDate = require('metalsmith-build-date'),
  templates = require('metalsmith-templates'),
  gulpFrontMatter = require('gulp-front-matter'),
  _ = require('lodash');

var paths = {
  build: 'build',
  content: 'src/content',
  templates: 'src/templates',
  assets: 'build/assets',
  data: 'src/data'
};

gulp.task('default', ['metalsmith']);

gulp.task('clean', function (done) {
  del(['build'], done);
});

gulp.task('metalsmith', ['clean'], function () {
  return gulp.src('src/content/**/*')
    .pipe(gulpFrontMatter()).on("data", function(file) {
      _.assign(file, file.frontMatter);
      delete file.frontMatter;
    })
    .pipe(gulpsmith()
      .use(buildDate())
      .use(drafts())
      .use(markdown({
        gfm: true
      }))
      .use(templates({
        engine: 'swig',
        directory: paths.templates
      })))
    .pipe(gulp.dest(paths.build));
});
