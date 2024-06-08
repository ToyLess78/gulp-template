'use strict';
import { src, dest, watch, parallel } from 'gulp';
import gulpSass from 'gulp-sass';
import sass from 'sass';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify-es';
import browserSyncModule from 'browser-sync';
import autoprefixer from 'gulp-autoprefixer';

const scss = gulpSass(sass);
const browserSync = browserSyncModule.create();

const scrips = () => {
    return src('app/js/main.js')
        .pipe(concat('main.min.js'))
        .pipe(uglify.default())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream());
};

const styles = () => {
    return src('app/scss/style.scss')
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 version'] }))
        .pipe(concat('style.min.css'))
        .pipe(scss.sync({ outputStyle: 'compressed' }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream());
};

const watching = () => {
    watch(['app/scss/style.scss'], styles);
    watch(['app/js/main.js'], scrips);
    watch(['app/*.html']).on('change', browserSync.reload);
};

const browserFn = () => {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    });
};

export { styles, scrips, watching, browserFn };
export default parallel(styles, scrips, browserFn, watching);
