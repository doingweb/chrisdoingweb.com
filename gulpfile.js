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
  browserSync = require('browser-sync'),
  runSequence = require('run-sequence'),
  _ = require('lodash');

var paths = {
  content: 'src/content',
  scss: 'src/scss',
  templates: 'src/templates',
  build: 'build',
  css: 'build/css'
};

var globs = {
  build: paths.build + '/**/*',
  scss: paths.scss + '/**/*.scss',
  content: paths.content + '/**/*',
  templates: paths.templates + '/**/*',
  css: paths.css + '{,/**/*}'
};

gulp.task('default', ['content', 'css']);

gulp.task('clean-all', function (done) {
  del([paths.build], done);
});

gulp.task('clean-content', function (done) {
  del([globs.build, '!' + globs.css], done);
});

gulp.task('clean-css', function (done) {
  del([paths.css], done);
});

gulp.task('content', ['clean-content'], function () {
  return gulp.src(globs.content)
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

gulp.task('css', ['clean-css'], function () {
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
    .pipe(gulp.dest(paths.css))
});

gulp.task('serve', ['default'], function () {
  browserSync({
    server: {
      baseDir: paths.build
    }
  });

  gulp.watch('{' + globs.content + ',' + globs.templates + '}', function () {
    runSequence('content', browserSync.reload);
  })

  gulp.watch(globs.scss, function () {
    runSequence('css', browserSync.reload);
  });
});
