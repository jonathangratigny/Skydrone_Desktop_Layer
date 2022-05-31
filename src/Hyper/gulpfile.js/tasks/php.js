var gulp = require("gulp"),
    fileinclude = require('gulp-file-include'),
    vars = require('../variables');

var php2html = require("gulp-php2html");
// copy html files from src folder to dist folder, also copy favicons
const copyPhp = function () {
    const baseSrc = vars.getSrcPath();
    const out = vars.getDistPath();

    // copy partials
    // gulp.src([baseSrc + '/partials/**/*']).pipe(gulp.dest(out + "/partials/"));

    return gulp
        .src([
            baseSrc + "*.php",
        ])
        .pipe(php2html())
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            indent: true
        }))
        .pipe(gulp.dest(out));
}

gulp.task(copyPhp);