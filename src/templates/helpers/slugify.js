module.exports.register = function (Handlebars, options, params) {
  Handlebars.registerHelper('slugify', function(url) {
    var matches = url.match(/(.*)index\.html$/);
    if (matches) {
      return matches[1];
    }
    return url;
  });
};
