---
title: Giving Up the Grunt
date: 2015-03-12
description: After finally launching my new website, I immediately began ripping out my build system and static site generator in favor of a pipelined approach.
---

<p class="lead">I'm usually a lot better at resisting the urge to rewrite my most recent project with whatever fancy new thing I'm learning about this week. I don't quite know what it was about Gulp that was different -- it may have been the sheer speed, the versatility of code over configuration, or maybe it was just that the pipeline model made a lot more sense to me. Whatever it was, I jumped on it. And it was totally worth it.</p>

# What's wrong with Grunt?

Nothing! Grunt is great! It has very straightforward conventions for [creating, registering](http://gruntjs.com/creating-tasks), and [configuring](http://gruntjs.com/configuring-tasks) tasks, and [the community is huge](http://gruntjs.com/plugins). The problem was really with how I was using it.

Grunt is designed for configuring and running tasks, especially tasks that need to run in a specific (sometimes complicated) sequence. This really lends itself to procedural builds where each individual task is atomic and can more or less stand on its own. But building a modern website is rarely like that.

## Building a Static Website

Let's take for example our CSS:

 * First off, we'll probably want to use a **preprocessor** of some kind, perhaps [Sass](http://sass-lang.com/), to give us nice things like variables and mixins.
 * If we're taking advantage of any newer or experimental CSS features, we'll surely want to use [**autoprefixer**](https://github.com/postcss/autoprefixer) so we're not bothered by those details.
 * If we care about performance, we'll probably also want to [**minify**](https://developers.google.com/speed/docs/insights/MinifyResources) and [**cache bust**](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching#invalidating-and-updating-cached-responses), then use [**sourcemaps**](https://developer.chrome.com/devtools/docs/css-preprocessors) to maintain debuggability on the client side.

Each of these steps fit nicely into Grunt's model of tasks -- there's some input, some output, probably a little configuration, and we want the steps to happen in a specific order.

Here's a minimal `Gruntfile.js` that performs our CSS build. :

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

  grunt.registerTask('build', ['sass', 'autoprefixer', 'cssmin', 'filerev', 'usemin']);

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-usemin');
};
```

This isn't too difficult to follow if you're familiar with Grunt. I've set up the `sass`, `autoprefixer`, `cssmin`, and `filerev` tasks to pick up my `site.scss`, pass around an intermediate file, then spit out the resulting `site.css` to the `dist` folder. Sourcemaps produced by `sass`, `autoprefixer`, and `cssmin` are picked up by the next task in the chain and updated accordingly. The `usemin` task's one job is to rewrite the `sourceMappingURL` so the sourcemap works with the freshly-revved CSS file.

While this gets the job done, there are a number of things that bother me about even this simple build:

 * **Most of the tasks I've defined don't stand alone.** The only task that really makes sense on its own is the `build` task. I have all of these other tasks set up, but for example, `grunt autoprefixer` doesn't do anything useful (and will in fact fail in a clean environment).
 * **I have to herd files.** Rather than describing the process of building all at once, I can only express to Grunt how each individual task needs to run, and I'm left handling the plumbing. Since every task deals with real files for its input and output, I have to keep track of all of those intermediate files and guide them on their way between tasks. Boring!
 * **Changing the build requires more effort than it should.** How do I make a new build task that skips minification and revving? How about one that also rewrites some HTML to use the revved filenames? Hint: it's not just a matter of deleting those steps or adding a collector step to the HTML build. :(
 * **It's actually pretty noisy.** Each new task that I configure will add *at least* 8 new lines to the config, only a few of which having any interesting information. Let's have a look at that `sass` task again:

```js
sass: {
  dist: {
    files: {
      '.tmp/site.css': 'site.scss'
    }
  }
}
```

The only real pieces of information we have here are `sass` and `'.tmp/site.css': 'site.scss'`. And the latter is just plumbing! All the rest is either boilerplate or brace soup.

It's nice to be able to use JavaScript objects to configure tasks, but if we look at our CSS build as a *composite transformation* instead of a series of independent tasks, things get a lot easier to describe.

# What's so great about Gulp?

[Gulp](http://gulpjs.com/)
