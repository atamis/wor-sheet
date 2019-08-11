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
const rename = require('gulp-rename');
const gulpFn  = require('gulp-fn');
const sass = require('gulp-sass');

sass.compiler = require('node-sass');

function html() {
    return gulp.src('templates/**/*.+(html|nunjucks|njk)')
        .pipe(nunjucksRender({
            path: ['src', 'target/partials'],
            // Changes nunjucks syntax because it overlaps with roll20 syntax
            envOptions: {
                tags: {
                    blockStart: '<%',
                    blockEnd: '%>',
                    variableStart: '<$',
                    variableEnd: '$>',
                    commentStart: '<#',
                    commentEnd: '#>'
                }
            }
        })).pipe(gulp.dest('target'));
}

html.description = "Compile pages from templates and partials from src to target.";

var maps = true;
var minify = true;



function js(done) {
    var entries = ['app.js', 'worker.js'];
    
    var tasks = entries.map((entry) => {
        var task =  browserify({entries: ['./src/' + entry], debug: true})
            .bundle()
            .pipe(source(entry))
            .pipe(rename({
                extname: '.bundle.js'
            }))
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

        return task
            .pipe(gulp.dest('target/partials/'));
    });

    return es.merge.apply(null, tasks).on('end', done);
}

js.description = "Browserify, transpile, and minify JS from ./src/entry.js to target/partials/app.js";

function css() {
    return gulp.src('src/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('target/'));
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
exports.css = css;
exports.js = js;
exports.watch = watch;
exports.default = def;
