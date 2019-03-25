const gulp = require('gulp');
const del = require('del');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');
const nunjucksRender = require('gulp-nunjucks-render');
const log = require('gulplog');

function html() {
    return gulp.src('src/**/*.+(html|nunjucks|njk)')
        .pipe(nunjucksRender({
            path: ['templates', 'target/partials']
        })).pipe(gulp.dest('target'));
}

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

function clean() {
    return del([
        'target/'
    ]);
}

exports.html = html;
exports.clean = clean;
exports.js = js;
exports.default = gulp.series(js, html);
