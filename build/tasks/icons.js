var
  gulp = require('gulp');

module.exports = {
  dev: function () { return iconsTask(); },
  prod: function () { return iconsTask(true); }
};

function iconsTask (prod) {
  
}
