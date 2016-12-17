var gulp            = require('gulp');

var config          = require('../config.js');

var self = {};

/**
 * Copy index file
 */
self.index = function() {
  return gulp.src([
    config.src + '/**/*.html',
    config.src + '/**/*.json',
    config.src + '/**/**/*.svg',
    config.src + '/**/**/*.png',
    config.src + '/**/*.css'
  ])
  .pipe(gulp.dest(config.dest));
}

gulp.task('copy', function() {
  return self.index();
});

module.exports = self;
