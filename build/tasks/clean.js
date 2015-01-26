var del = require('del');

module.exports = {
  all: function cleanAllTask (done) {
    del(['dist'], done);
  },
  content: function cleanContentTask (done) {
    del(['dist/**/*', '!dist/css{,/**/*}'], done);
  },
  css: function cleanCssTask (done) {
    del(['dist/css'], done);
  },
  js: function cleanJsTask (done) {
    del(['dist/js'], done);
  }
};
