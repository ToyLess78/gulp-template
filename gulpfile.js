'use strict';
const {src, dest, watch, parallel} = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const scrips = () => {
    return src('app/js/main.js')
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream());
}

const styles = () => {
    return src('app/scss/style.scss')
        .pipe(autoprefixer({overrideBrowserslist: ['last 10 version']}))
        .pipe(concat('style.min.css'))
        .pipe(scss.sync({outputStyle: 'compressed'}))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream());
}

const watching = () => {
    watch(['app/scss/style.scss'], styles)
    watch(['app/js/main.js'], scrips)
    watch(['app/*.html']).on('change', browserSync.reload);
}

const browserFn = () => {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    });
}

exports.styles = styles;
exports.scrips = scrips;
exports.watching = watching;
exports.browserFn = browserFn;
exports.default = parallel(styles, scrips, browserFn, watching);