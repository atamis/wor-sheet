'use strict';

const gulp = require('gulp');
const del = require('del');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');
const nunjucksRender = require('gulp-nunjucks-render');
const log = require('gulplog');

var sass = require('gulp-sass');

sass.compiler = require('node-sass');

function html() {
    return gulp.src('src/**/*.+(html|nunjucks|njk)')
        .pipe(nunjucksRender({
            path: ['templates', 'target/partials']
        })).pipe(gulp.dest('target'));
}

html.description = "Compile HTML from src and partials from templates to target.";

function js() {
    var b = browserify({
        entries: './src/entry.js',
        debug: true
    });

    return b.bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(terser())
        .on('error', log.error)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('target/partials/'));
}

js.description = "Browserify, transpile, and minify JS from ./src/entry.js to target/partials/app.js";

function css() {
    return gulp.src('src/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('target/partials/'));
}

css.description = "Compile SASS from src/ to target/partials/";

function clean() {
    return del([
        'target/'
    ]);
}

clean.description = "Clean the target directory.";

const def = gulp.series(gulp.parallel(js, css), html);

def.description = "Compile everything.";

function watch() {
    gulp.watch(["src/**/*", "templates/**/*"],
               {ignoreInitial: false},
               def
              );
}

watch.description = "Watch src and templates and recompile with the default task.";

exports.html = html;
exports.clean = clean;
exports.js = js;
exports.watch = watch;
exports.default = def;
