'use strict';

var
  gulp = require('gulp'),
  debug = require('gulp-debug'),
  del = require('del'),
  gulpsmith = require('gulpsmith'),
  buildDate = require('metalsmith-build-date'),
  metadata = require('metalsmith-metadata'),
  collections = require('metalsmith-collections'),
  meach = require('metalsmith-each'),
  markdown = require('metalsmith-markdown'),
  templates = require('metalsmith-templates'),
  permalinks = require('metalsmith-permalinks'),
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
      .use(metadata({
        site: 'metadata/site.yaml',
        contact: 'metadata/contact.yaml'
      }))
      .use(collections({
        posts: 'blog/*.md'
      }))
      .use(meach(function (file, filename) {
        if (file.collection.indexOf('posts') !== -1) {
          file.template = 'post-layout.html';
        }
      }))
      .use(markdown({
        gfm: true
      }))
      .use(templates({
        engine: 'swig',
        directory: paths.templates
      }))
      .use(permalinks({
        relative: false
      })))
    .pipe(gulp.dest(paths.build));
});
