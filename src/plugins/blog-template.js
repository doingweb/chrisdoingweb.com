'use strict';

module.exports = function () {
  return function blogTemplate (files, metalsmith, done) {
    var posts = metalsmith._metadata.collections.posts;
    for (var i = 0; i < posts.length; i++) {
      posts[i].template = 'post-layout.html';
    }
    done();
  };
}
