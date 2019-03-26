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
const es = require('event-stream');

var sass = require('gulp-sass');

sass.compiler = require('node-sass');

function html() {
    return gulp.src('src/**/*.+(html|nunjucks|njk)')
        .pipe(nunjucksRender({
            path: ['templates', 'target/partials']
        })).pipe(gulp.dest('target'));
}

html.description = "Compile HTML from src and partials from templates to target.";

var maps = true;
var minify = true;

function js(done) {
    var entries = ['app.js', 'worker.js'];
    
    var tasks = entries.map((entry) => {
        var task =  browserify({entries: ['./src/' + entry], debug: true})
            .bundle()
            .pipe(source(entry))
            .pipe(buffer());

        if (maps) {
            task = task.pipe(sourcemaps.init({loadMaps: true}));
        }

        if (minify) {
            task = task.pipe(terser())
                .on('error', log.error);
        }
        if (maps) {
            task = task.pipe(sourcemaps.write('./'));
        }

        return task.pipe(gulp.dest('target/partials/'));
    });

    return es.merge.apply(null, tasks).on('end', done);
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
