var
  fs = require('fs'),
  yaml = require('js-yaml'),
  path = require('path'),
  gulp = require('gulp'),
  svgmin = require('gulp-svgmin'),
  svgstore = require('gulp-svgstore'),
  rename = require('gulp-rename'),
  rev = require('gulp-rev'),
  paths = {
    icons: 'bower_components/icomoon-free/SVG',
    contact: 'src/content/metadata/contact.yaml'
  };

module.exports = {
  dev: function () { return iconsTask(); },
  prod: function () { return iconsTask(true); }
};

function iconsTask (prod) {
  var contactLinks = yaml.load(fs.readFileSync(paths.contact)).links;
  var icons = contactLinks.map(function (link) { return path.join(paths.icons, link.icon + '.svg'); });

  var sprite = gulp.src(icons)
    .pipe(svgstore())
    .pipe(rename('icons.svg'));

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
    return sprite
      .pipe(rev.manifest('rev-manifest-icons.json'))
      .pipe(gulp.dest('build/.metadata'));
  }

  return sprite;
}
