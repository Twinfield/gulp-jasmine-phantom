'use strict'
var path = require('path'),
    gutil = require('gulp-util'),
    through = require('through2'),
    handlebar = require('handlebars'),
    fs = require('fs'),
    childProcess = require('child_process');

module.exports = function (options) {
  options = options || {};
  
  if(!!options.integration) {
    var phantomjs = require('phantom'),
        filePaths = [];
    gutil.log('Running Jasmine with PhantomJS');
    
    return through.obj(
      function (file, encoding, callback) {
        var phantomPath = phantomjs.path;
        
        if (file.isNull()) {
          callback(null, file);
          return;
        }

        if (file.isStream()) {
          callback(new gutil.PluginError('gulp-jasmine-phantom', 'Streaming not supported'));
        }
        
        filePaths.push(file.path);
        callback(null, file);
      }, function (callback) {
        // Create the specRunner.html file
        fs.readFile('./lib/specRunner.handlebars', 'utf8', function(error, data) {
          if (error) throw error;
          var specFile = handlebar.compile(data),
              specRunner = specFile({files: filePaths});

          console.log(specRunner);
        });

      } 
    );
  } else {
    var miniJasmineLib = require('minijasminenode2');
    gutil.log('Running Jasmine with minijasminenode2');
    return through.obj(
        // -----------------
        // Transform function
        // Takes in each file and adds it to the list of specs
        // -----------------
        function(file, encoding, callback) {
          // If file is null exit with callback
          if (file.isNull()) {
            callback(null, file);
            return;
          }
          
          // -----------------
          // Currently do not support streams
          // -----------------
          if (file.isStream()) {
            callback(new gutil.PluginError('gulp-jasmine-phantom', 'Streaming not supported'));
            return;
          }
          

        miniJasmineLib.addSpecs(file.path);
        callback(null, file);
      }, 
      // -----------------
      // Flush function
      // Finishes up the stream and runs all the test cases that have been provided
      //
      // TODO: Run unit tests and integration tests seperately
      // -----------------
      function(callback) {
        try {
          miniJasmineLib.executeSpecs({
            isVerbose: true,
            includeStackTrace: true,
            onComplete: function(passed) {
              if(passed) {
                callback(null);
              } else {
                callback(new gutil.PluginError('gulp-jasmine-phantom', 'Tests failed', {showStack: false}));
              }
            }
          });
        } catch(error) {
          callback(new gutil.PluginError('gulp-jasmine-phantom', error));
        }
      }
    );
  }

};
