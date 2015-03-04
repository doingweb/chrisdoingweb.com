---
title: (Re)Building a Static Website with Gulp and Metalsmith
date: 2015-03-03
description: After finally launching my new website, I immediately began ripping out my build system and static site generator in favor of a pipelined approach.
---

<p class="lead">I'm usually a lot better at resisting the urge to rewrite my most recent project with whatever fancy new thing I'm learning about this week. I don't quite know what it was about Gulp that was different -- it may have been the sheer speed, the versatility of code over configuration, or maybe it was just that the pipeline model made a lot more sense to me. Whatever it was, I jumped on it. And it was totally worth it.</p>

# What's wrong with Grunt?

Nothing! Grunt is great! It has very straightforward conventions for [creating, registering](http://gruntjs.com/creating-tasks), and [configuring](http://gruntjs.com/configuring-tasks) tasks, and [the community is huge](http://gruntjs.com/plugins). The problem was really with [how I was using it](https://github.com/doingweb/chrisdoingweb.com/blob/54bc6ca8613cb1bbeda0c61b9181835475db9541/Gruntfile.js).

Grunt is designed for configuring and running tasks, especially tasks that need to run in a specific (sometimes complicated) sequence. This really lends itself to procedural builds where each step is atomic and can more or less stand on its own. But building a modern static website is rarely like that.

## Building a Static Website

Let's take for example our CSS:

 * First off, we'll probably want to use a **preprocessor** of some kind, perhaps [Sass](http://sass-lang.com/), to give us nice things like variables and mixins.
 * If we're taking advantage of any newer or experimental CSS features, we'll surely want to use [**autoprefixer**](https://github.com/postcss/autoprefixer) so we're not bothered by those details.
 * If we care about performance, we'll probably also want to [**minify**](https://developers.google.com/speed/docs/insights/MinifyResources), [**cache bust**](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching#invalidating-and-updating-cached-responses), and then use [**sourcemaps**](https://developer.chrome.com/devtools/docs/css-preprocessors) to maintain debuggability on the client side.

Each of these steps fit nicely into Grunt's model of tasks; there's some input, some output, and probably a little configuration. And we want them to happen in a specific order. However, it's what happens *between* the tasks where Grunt tends to get in the way.

Here's a simplified `Gruntfile.js` that performs our CSS build. :

```js
module.exports = function(grunt) {
  grunt.initConfig({
    sass: {
      dist: {
        files: {
          '.tmp/site.css': 'site.scss'
        }
      }
    },
    autoprefixer: {
      options: {
        map: true
      },
      dist: {
        src: '.tmp/site.css'
      }
    },
    cssmin: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          '.tmp/site.css': '.tmp/site.css'
        }
      }
    },
    filerev: {
      dist: {
        files: {
          'dist': '.tmp/site.css'
        }
      }
    },
    usemin: {
      sourcemaps: 'dist/site.*.css',
      options: {
        assetsDirs: ['.tmp'],
        patterns: {
          sourcemaps: [
            [/sourceMappingURL=([a-z0-9.]*\.map)/, 'sourcemap path']
          ]
        }
      }
    }
  });

  grunt.registerTask('default', ['sass', 'autoprefixer', 'cssmin', 'filerev', 'usemin']);

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-debug-task');
};

```

# What's so great about Gulp?

## Assemble

I wanted a JavaScript SSG that was paradoxically an all-in-one solution *and* unopinionated enough to let me control how to build my assets. I initially rejected Metalsmith because it seemed to lack several of the features of the big monoliths, like Jekyll or Wintersmith.

# What's so great about Gulp?
