var paths = require('./paths');

module.exports = {
  build: paths.build + '/**/*',
  scss: paths.scss + '/**/*.scss',
  content: paths.content + '/**/*',
  templates: paths.templates + '/**/*',
  css: paths.css + '{,/**/*}'
};
