var gulp          = require('gulp'),
    watch         = require('gulp-watch'),
    gulpSequence  = require('gulp-sequence');

gulp.task('watch', function () {
    // Callback mode, useful if any plugin in the pipeline depends on the `end`/`flush` event
    return watch('./src/**/*.js', function () {
        console.log('update');
        gulpSequence('browserify')();
    });
});
