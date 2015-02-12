var
  fs = require('fs'),
  path = require('path'),
  glob = require('glob');

console.log('Renaming highlight.js styles for Sass...');
glob(path.join('bower_components', 'highlightjs', 'styles', '*.css'), function (err, files) {
  var renamed = files.map(function (file) {
    var newFile = path.join(path.dirname(file), '_' + path.basename(file, '.css') + '.scss');
    fs.renameSync(file, newFile);
    console.log(file + ' -> ' + newFile);
  });
});
