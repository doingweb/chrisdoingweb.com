var
  del = require('del'),
  paths = require('../paths'),
  globs = require('../globs');

module.exports = {
  all: function cleanAllTask (done) {
    del([paths.build], done);
  },
  content: function cleanContentTask (done) {
    del([globs.build, '!' + globs.css], done);
  },
  css: function cleanCssTask (done) {
    del([paths.css], done);
  },
  js: function cleanJsTask (done) {
    del(['dist/js'], done);
  }
};
