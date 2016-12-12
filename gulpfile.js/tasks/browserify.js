var gulp = require('gulp'),
    browserify = require('gulp-browserify');

var config          = require('../config.js');

// Basic usage
gulp.task('browserify', function() {
    // Single entry point to browserify
    gulp.src('src/app.js')
        .pipe(browserify({
          insertGlobals : true,
          debug : !gulp.env.production
        }))
        .pipe(gulp.dest('./dest/'))
});
