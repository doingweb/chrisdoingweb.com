---
title: Minifying Browserified Angular Modules
date: 2015-07-05
description: Fixing "Unknown provider" errors by helping ng-annotate work with Browserify-ready CommonJS modules.
aliases:
  - /blog/minifying-browserified-angular-modules/
tags:
  - frontend
  - javascript
  - angular
---

If you've used [Angular](https://angularjs.org/) in production, you've probably learned the importance of [annotating your dependencies](https://docs.angularjs.org/guide/di#dependency-annotation) when using a minifier like [Uglify](https://github.com/mishoo/UglifyJS2): when parameter names get [mangled](http://lisperator.net/uglifyjs/mangle), Angular's implicit annotation feature breaks. The [ng-annotate](https://www.npmjs.com/package/ng-annotate) package does a great job at alleviating us of this responsibility, but it may need a little hint when you're using something like [Browserify](http://browserify.org/) to organize your code as CommonJS modules.

Let's describe the problem with a little bit of code. First, a simple Angular app authored as a CommonJS module:

```js
var angular = require('angular');

angular
  .module('GreeterApp', [])
  .controller('greeterController', require('./greeter-controller'))
  .factory('greeter', require('./greeter'));
```

We've already installed [Angular through npm](https://www.npmjs.com/package/angular), so this is all ready to be Browserified. Here's the Gulp pipeline that does just that:

```js
var
	gulp = require('gulp'),
	browserify = require('browserify'),
	buffer = require('vinyl-buffer'),
	source = require('vinyl-source-stream'),
	ngAnnotate = require('gulp-ng-annotate'),
	uglify = require('gulp-uglify');

gulp.task('default', function() {
  return browserify('./app.js')
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});
```

It packages up `app.js` with **Browserify > ng-annotate > Uglify** and then drops it into the `dist` directory.

The `greeter-controller.js` doesn't have much to it, either:

```js
module.exports = function($scope, greeter) {
  $scope.greeting = greeter.getGreeting('english');
};
```

The controller gets an English greeting from the `greeter` service and puts it in the scope for the view to display. Notice the lack of explicit annotations here; we're hoping ng-annotate will take care of that for us.

But when we build and run the app, we get the following error in the browser console:

```
Error: [$injector:unpr] Unknown provider: eProvider <- e <- greeterController
http://errors.angularjs.org/1.4.1/$injector/unpr?p0=eProvider%20%3C-%20e%20%3C-%20greeterController
    at app.js:1
    at app.js:1
    at Object.r [as get] (app.js:1)
    at app.js:1
    at r (app.js:1)
    at Object.i [as invoke] (app.js:1)
    at $get.f.instance (app.js:2)
    at v (app.js:1)
    at s (app.js:1)
    at s (app.js:1)
```

The [documentation page for the error](https://docs.angularjs.org/error/$injector/unpr) decodes this for us:

> This error results from the `$injector` being unable to resolve a required dependency.

Investigating our `./dist/app.js`, we notice the controller has been turned to:

```js
t.exports=function(e,t){e.greeting=t.getGreeting("english")}
```

No annotations! Angular is looking for a [provider](https://docs.angularjs.org/guide/providers) for whatever `e` is, rather than `$scope`!

What looks like ng-annotate failing to do its job is really just us failing to read the docs very closely. It turns out the CommonJS module pattern is one of those *un*-common cases that the [ng-annotate documentation](https://github.com/olov/ng-annotate/blob/v1.0.1/README.md) loudly warns us about:

> **ng-annotate works by using static analysis to identify common code patterns. There are patterns it does not and never will understand and for those you can use an explicit `ngInject` annotation instead, see section further down.**

The [section it refers to](https://github.com/olov/ng-annotate/blob/v1.0.1/README.md#explicit-annotations-with-nginject) gives us a few options that can solve our problem. My favorite is prepending the function declaration with `/*@ngInject*/`:

```js
module.exports = /*@ngInject*/ function($scope, greeter) {
  $scope.greeting = greeter.getGreeting('english');
};
```

When we re-run the build, our output includes all of the annotations we were missing:

```js
t.exports=["$scope","greeter",function(e,t){e.greeting=t.getGreeting("english")}]
```

And all is well.
