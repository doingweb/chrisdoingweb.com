// There must be a better way of doing this.

var options = {
  stage: 'render:pre:page'
};


var plugin = function(params, next) {
  var posts = [];

  // Get just the posts.
  params.context.pages.forEach(function (page) {
    if (page.basename !== 'index' && page.dirname === 'dist/blog') {
      posts.push(page);
    }
  });

  // Sort them by date.
  posts.sort(function (a, b) {
    return b.data.date - a.data.date;
  });

  params.context.posts = posts;

  next();
};

plugin.options = options;
module.exports = plugin;
