'use strict';

var
  gulp = require('gulp'),
  debug = require('gulp-debug'),
  del = require('del'),
  gulpFrontMatter = require('gulp-front-matter'),
  gulpsmith = require('gulpsmith'),
  buildDate = require('metalsmith-build-date'),
  metadata = require('metalsmith-metadata'),
  collections = require('metalsmith-collections'),
  meach = require('metalsmith-each'),
  markdown = require('metalsmith-markdown'),
  permalinks = require('metalsmith-permalinks'),
  templates = require('metalsmith-templates'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-minify-css'),
  sourcemaps = require('gulp-sourcemaps'),
  _ = require('lodash');

var paths = {
  build: 'build',
  content: 'src/content',
  scss: 'src/scss',
  templates: 'src/templates',
  data: 'src/data'
};

gulp.task('default', ['metalsmith', 'css']);

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
      .use(permalinks({
        relative: false
      }))
      .use(templates({
        engine: 'swig',
        directory: paths.templates
      })))
    .pipe(gulp.dest(paths.build));
});

gulp.task('css', ['clean'], function () {
  return gulp.src(paths.scss + '/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['bower_components']
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(minifycss())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.build + '/css'))
});
