var del = require('del');

module.exports = {
  all: function cleanAllTask (done) {
    del(['dist'], done);
  },
  content: function cleanContentTask (done) {
    del(['dist/**/*', '!dist/{css,js,images}{,/**/*}'], done);
  },
  icons: function cleanIconsTask (done) {
    del(['dist/images/icons.svg'], done);
  },
  css: function cleanCssTask (done) {
    del(['dist/css'], done);
  },
  js: function cleanJsTask (done) {
    del(['dist/js'], done);
  },
  buildMetadata: function cleanBuildMetadataTask (done) {
    del(['build/.metadata'], done);
  }
};
