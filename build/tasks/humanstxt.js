var
  debug = require('gulp-debug'),
  gulp = require('gulp'),
  humans = require('humans-generator'),
  moment = require('moment');

module.exports = function humanstxtTask (done) {
  var humanstxt = humans({
    header: 'chrisdoingweb.com',
    team: {
      'Developer': 'Chris Antes',
      'Site': 'http://chrisdoingweb.com',
      'Twitter': '@doingweb',
      'Location': 'Pullman, Washington, USA'
    },
    site: {
      'Source': 'https://github.com/doingweb/chrisdoingweb.com',
      'Components': 'Foundation, Metalsmith, Modernizr, jQuery, Highlight.js, IcoMoon SVG icons',
      'Software': 'Gulp, Atom',
      'Last update': moment().format('YYYY/MM/DD')
    },
    out: 'dist/humans.txt',
    callback: done
  });
};
