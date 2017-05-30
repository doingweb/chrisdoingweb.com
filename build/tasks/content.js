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
  inPlace = require('metalsmith-in-place'),
  layout = require('metalsmith-layouts'),
  filter = require('gulp-filter'),
  htmlmin = require('gulp-htmlmin'),
  merge = require('merge-stream'),
  cdnizer = require('gulp-cdnizer'),
  revCollector = require('gulp-rev-collector'),
  icons = require('./icons'),
  settings = {
    metadata: {
      site: 'metadata/site.yaml',
      contact: 'metadata/contact.yaml'
    },
    collections: {
      posts: {
        pattern: 'blog/*.md',
        sortBy: 'date',
        reverse: true
      }
    },
    markdown: {
      gfm: true,
      smartypants: true
    },
    permalinks: {
      relative: false
    },
    layout: {
      engine: 'swig',
      directory: 'src/templates'
    },
    cdnizer: {
      files: ['google:jquery'],
      fallbackScript: '',
      fallbackTest: '<script>${ test } || document.write(\'<script src="${ filepath }"><\\/script>\')<\/script>'
    },
    htmlmin: {
      removeComments: true,
      collapseWhitespace: true
    }
  };

function buildTask () {
  setupSwig();

  return gulp.src('src/content/**/*')
    .pipe(gulpFrontMatter()).on("data", moveFrontMatterPropertiesToFile)
    .pipe(gulpsmith()
      .use(buildDate())
      .use(metadata(settings.metadata))
      .use(collections(settings.collections))
      .use(setLayoutForBlogPosts())
      .use(highlightjs())
      .use(markdown(settings.markdown))
      .use(permalinks(settings.permalinks))
      .use(inPlace())
      .use(layout(settings.layout)))
    .pipe(gulp.dest('dist'));
}

function prodTask() {
  return merge(gulp.src('dist/**/*.html'), gulp.src('build/.metadata/rev-manifest-*.json'))
    .pipe(revCollector())
    .pipe(cdnizer(settings.cdnizer))
    .pipe(htmlmin(settings.htmlmin))
    .pipe(gulp.dest('dist'));
}

function moveFrontMatterPropertiesToFile(file) {
  _.assign(file, file.frontMatter);
  delete file.frontMatter;
}

function setLayoutForBlogPosts() {
  return meach(function (file, filename) {
    if (file.collection.indexOf('posts') !== -1) {
      file.layout = 'post-layout.html';
    }
  });
}

function setupSwig() {
  swig.invalidateCache();
}

module.exports = {
  build: buildTask,
  prod: prodTask
};
