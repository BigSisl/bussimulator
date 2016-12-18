var gulp          = require('gulp'),
    gulpSequence  = require('gulp-sequence');

gulp.task('default', function (cb) {
    // Callback mode, useful if any plugin in the pipeline depends on the `end`/`flush` event
    gulpSequence(['copy', 'browserify'], cb);
});
