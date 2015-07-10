var
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

}

function prodTask() {

}

function metalsmithPlugin(prod) {
  return function buildSprite(files, metalsmith, done){
    var
      icons = {},
      re = new RegExp('^/icons.svg#i(.+)$');

    for (var file in files) {
      var $ = cheerio.load(files[file].contents);
      $('svg.icon use').each(function() {
        var match = $(this).attr('xlink:href').match(re);
        if (match) {
          icons[match[1]] = true;
        }
      });
    }

    var iconPaths = [];
    for (var icon in icons) {
      iconPaths.push(iconPath(icon));
    }

    buildIconSprite(iconPaths, prod, done);
  };
}

function buildIconSprite(icons, prod, done) {
  var sprite = gulp.src(icons)
    .pipe(rename({prefix: 'i'}))
    .pipe(svgstore())
    .pipe(rename('icons.svg'))
    .pipe(gcheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
      },
      parserOptions: { xmlMode: true }
    }));

  if (prod) {
    sprite = sprite
      .pipe(svgmin({
        plugins: [{ cleanupIDs: false }]
      }))
      .pipe(rev());
  }

  sprite = sprite
    .pipe(gulp.dest('dist/images'));

  if (prod) {
    sprite = sprite
      .pipe(rev.manifest('rev-manifest-icons.json'))
      .pipe(gulp.dest('build/.metadata'));
  }

  sprite.on('end', function() {
    done();
  });
}

function iconPath(iconName) {
  return path.join(iconsPath, iconName + '.svg');
}

module.exports = {
  build: buildTask,
  prod: prodTask
};
