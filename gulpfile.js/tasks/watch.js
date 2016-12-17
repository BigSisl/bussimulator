var gulp          = require('gulp'),
    gulpSequence  = require('gulp-sequence');

gulp.task('watch', function () {
    // Callback mode, useful if any plugin in the pipeline depends on the `end`/`flush` event
    gulp.watch('./src/**/*.js', ['browserify']);
});
