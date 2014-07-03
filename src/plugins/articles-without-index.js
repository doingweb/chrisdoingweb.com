// There must be a better way of doing this.

var options = {
  stage: 'render:pre:page'
};


var plugin = function(params, next) {
  var articles = [];

  // Get just the articles.
  params.context.pages.forEach(function (page) {
    if (page.basename !== 'index' && page.dirname === 'dist/articles') {
      articles.push(page);
    }
  });

  // Sort them by date.
  articles.sort(function (a, b) {
    return b.data.date - a.data.date;
  });

  params.context.articles = articles;

  next();
};

plugin.options = options;
module.exports = plugin;
