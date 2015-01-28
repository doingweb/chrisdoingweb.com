var
  _ = require('lodash'),
  gulp = require('gulp'),
  globs = require('../globs'),
  gulpFrontMatter = require('gulp-front-matter'),
  gulpsmith = require('gulpsmith'),
  buildDate = require('metalsmith-build-date'),
  metadata = require('metalsmith-metadata'),
  collections = require('metalsmith-collections'),
  meach = require('metalsmith-each'),
  markdown = require('metalsmith-markdown'),
  permalinks = require('metalsmith-permalinks'),
  templates = require('metalsmith-templates'),
  filter = require('gulp-filter'),
  htmlmin = require('gulp-htmlmin'),
  merge = require('merge-stream'),
  revCollector = require('gulp-rev-collector');

module.exports = {
  dev: function () { return contentTask(); },
  deploy: function () { return contentTask(true); }
};

function contentTask (deploy) {
  var content = gulp.src(globs.content)
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
        directory: 'src/templates'
      })));

  if (deploy) {
    var htmlFilter = filter('**/*.html');
    content = merge(content, gulp.src('build/.metadata/rev-manifest-*.json'))
      .pipe(revCollector())
      .pipe(htmlFilter)
      .pipe(htmlmin({
        removeComments: true,
        collapseWhitespace: true
      }))
      .pipe(htmlFilter.restore());
  }

  return content
    .pipe(gulp.dest('dist'));
}
