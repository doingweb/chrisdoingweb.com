var
  _ = require('lodash'),
  gulp = require('gulp'),
  gulpFrontMatter = require('gulp-front-matter'),
  gulpsmith = require('gulpsmith'),
  buildDate = require('metalsmith-build-date'),
  metadata = require('metalsmith-metadata'),
  collections = require('metalsmith-collections'),
  meach = require('metalsmith-each'),
  highlightjs = require('metalsmith-metallic'),
  markdown = require('metalsmith-markdown'),
  permalinks = require('metalsmith-permalinks'),
  swig = require('swig'),
  templates = require('metalsmith-templates'),
  filter = require('gulp-filter'),
  htmlmin = require('gulp-htmlmin'),
  merge = require('merge-stream'),
  cdnizer = require('gulp-cdnizer'),
  revCollector = require('gulp-rev-collector');

module.exports = {
  dev: function () { return contentTask(); },
  prod: function () { return contentTask(true); }
};

function contentTask (prod) {
  swig.invalidateCache();

  var content = gulp.src('src/content/**/*')
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
        posts: {
          pattern: 'blog/*.md',
          sortBy: 'date',
          reverse: true
        }
      }))
      .use(meach(function (file, filename) {
        if (file.collection.indexOf('posts') !== -1) {
          file.template = 'post-layout.html';
        }
      }))
      .use(highlightjs())
      .use(markdown({
        gfm: true,
        smartypants: true
      }))
      .use(permalinks({
        relative: false
      }))
      .use(templates({
        engine: 'swig',
        directory: 'src/templates'
      })));

  if (prod) {
    var htmlFilter = filter('**/*.html');
    content = merge(content, gulp.src('build/.metadata/rev-manifest-*.json'))
      .pipe(revCollector())
      .pipe(htmlFilter)
      .pipe(cdnizer({
        files: ['google:jquery'],
        fallbackScript: '',
        fallbackTest: '<script>${ test } || document.write(\'<script src="${ filepath }"><\\/script>\')<\/script>'
      }))
      .pipe(htmlmin({
        removeComments: true,
        collapseWhitespace: true
      }))
      .pipe(htmlFilter.restore());
  }

  return content
    .pipe(gulp.dest('dist'));
}
