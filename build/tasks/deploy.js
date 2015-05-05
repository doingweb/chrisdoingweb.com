var
  s3 = require('gulp-awspublish'),
  fs = require('fs'),
  gulp = require('gulp'),
  s3options = require('gulp-awspublish-router');

module.exports = function deployTask () {
  var credentials = JSON.parse(fs.readFileSync('credentials.json'));
  var publisher = s3.create(credentials.aws);

  return gulp.src('dist/**/*')
    .pipe(s3options({
      routes: {
        '^(css|js)[\\\\/]': {
          cacheTime: 315360000,
          gzip: true
        },
        '\\.(html|css|js|txt|eot|otf|svg|ttf)$': {
          gzip: true
        },
        '^.+$': '$&'
      }
    }))
    .pipe(publisher.publish())
    .pipe(publisher.sync())
    .pipe(publisher.cache())
    .pipe(s3.reporter());
};
