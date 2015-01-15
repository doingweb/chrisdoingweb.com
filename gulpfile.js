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
      .use(drafts())
      .use(markdown({
        gfm: true
      }))
      .use(buildDate())
      .use(templates({
        engine: 'swig',
        directory: paths.templates
      })))
    .pipe(gulp.dest(paths.build));
});

gulp.task('assemble', function () {
  var options = {
    layoutdir: paths.templates + '/layouts',
    layout: 'site.hbs',
    partials: paths.templates + '/partials/*.hbs',
    assets: paths.assets,
    data: paths.data + '/*.{json,yml}',
    helpers: [paths.templates + '/helpers/*.js', 'helper-moment', 'handlebars-helper-twitter'],
    marked: {
      gfm: true
    },
    plugins: ['assemble-contrib-permalinks'],
    sitemap: {
      dest: paths.dist
    },
    permalinks: {
      preset: 'pretty'
    }
  };

  // Root
  gulp.src(paths.content + '/*.{md,hbs}')
    .pipe(assemble(options))
    .pipe(gulp.dest(paths.dist + '/'))

  // Blog
  options.layout = 'post.hbs';
  options.plugins.push(paths.src + '/plugins/posts-without-index.js');
  gulp.src(paths.content + '/blog/**/*.{md,hbs}')
    .pipe(assemble(options))
    .pipe(gulp.dest(paths.dist + '/blog/'))
});
