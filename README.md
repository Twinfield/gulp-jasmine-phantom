gulp-jasmine-phantom
=============

A gulp plugin that runs Jasmine tests with either PhantomJS or minijasminenode2.

Dependencies
------------

Before you install `gulp-jasmine-phantom` please enusre that you have PhantomJS
installed on your machine. The plugin assumes that the `phantomjs` binary is
available in the PATH and executable from the command line.

**If you do not have `phantomjs` installed please install following [these directions.](http://phantomjs.org/download.html)

Install
-----

```
$ npm install --save-dev gulp-jasmine-phantom
```

Usage
-----
By default `gulp-jasmine-phantom` runs your tests with `minijasminenode` and not `phantomjs`.
This is in an effort to keep your tasks running as quickly as possible!

Basic useage:
```javascript
var gulp = require('gulp');
var jasmine = require('gulp-jasmine-phantom');

gulp.task('default', function () {
  return gulp.src('spec/test.js')
          .pipe(jasmine());
});
```
To use `phantomjs` for tests (ie: integration tests) use the following setup:

```javascript
var gulp = require('gulp');
var jasmine = require('gulp-jasmine-phantom');

gulp.task('default', function() {
  return gulp.src('spec/test.js')
          .pipe(jasmine({
            integration: true
          }));
});
```

Also, remember you can always run any multitude of tests using different Gulp tasks. For example, running unit tests and integration tests asynchronously.

```javascript
var gulp = require('gulp');
var jasmine = require('gulp-jasmine-phantom');

gulp.task('unitTests', function () {
  return gulp.src('spec/test.js')
          .pipe(jasmine());
});

gulp.task('integrationTests', function() {
  return gulp.src('spec/test.js')
          .pipe(jasmine({
            integration: true
          }));
});
```

Options
-------

#### integration
Type: `boolean`
Default: false

Run your tests with `phantomjs`

#### keepRunner
Type: `boolean | string`
Default: false

Keep the `specRunner.html` file after build. If given a string, it will keep the runner at the string path.

Technologies Used
-----------------

* Node
* Gulp

Team Members
------------

* [Daniel Flynn](https://github.com/dflynn15)
* [Rob Tarr](https://github.com/robtarr)
