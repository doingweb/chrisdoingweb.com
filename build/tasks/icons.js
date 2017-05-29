const
  fs = require('fs'),
  yaml = require('js-yaml'),
  path = require('path'),
  gulp = require('gulp'),
  svgmin = require('gulp-svgmin'),
  svgstore = require('gulp-svgstore'),
  cheerio = require('cheerio'),
  gcheerio = require('gulp-cheerio'),
  rename = require('gulp-rename'),
  rev = require('gulp-rev'),
  iconsPath = 'bower_components/icomoon-free/SVG';

function buildTask() {
  return buildIconSprite(getIconPaths(), false);
}

function prodTask() {
  return buildIconSprite(getIconPaths(), true);
}

function getIconPaths () {
  const iconListPath = path.join('src', 'content', 'metadata', 'icons.yaml'),
    icons = yaml.load(fs.readFileSync(iconListPath, 'utf8'));

  return icons.map(getIconPath);
}

function buildIconSprite(iconPaths, isProd) {
  let sprite = gulp.src(iconPaths)
    .pipe(rename({prefix: 'i'}))
    .pipe(svgstore())
    .pipe(rename('icons.svg'))
    .pipe(gcheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
      },
      parserOptions: { xmlMode: true }
    }));

  if (isProd) {
    sprite = sprite
      .pipe(svgmin({
        plugins: [{ cleanupIDs: false }]
      }))
      .pipe(rev());
  }

  sprite = sprite
    .pipe(gulp.dest('dist/images'));

  if (isProd) {
    sprite = sprite
      .pipe(rev.manifest('rev-manifest-icons.json'))
      .pipe(gulp.dest('build/.metadata'));
  }

  return sprite;
}

function getIconPath(iconName) {
  return path.join(iconsPath, iconName + '.svg');
}

module.exports = {
  build: buildTask,
  prod: prodTask
};
