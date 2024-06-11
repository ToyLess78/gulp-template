'use strict';
import { src, dest, watch, parallel, series } from 'gulp';
import gulpSass from 'gulp-sass';
import sass from 'sass';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify-es';
import browserSyncModule from 'browser-sync';
import autoprefixer from 'gulp-autoprefixer';
import clean from 'gulp-clean';
import include from 'gulp-file-include';

const scss = gulpSass(sass);
const browserSync = browserSyncModule.create();

export const html = () => {
    return src('app/html/*.html')
        .pipe(include({
            prefix: '@@'
        }))
        .pipe(dest('app'))
}

export const scrips = () => {
    return src('app/js/main.js')
        .pipe(concat('main.min.js'))
        .pipe(uglify.default())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream());
};

export const styles = () => {
    return src('app/scss/style.scss')
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 version'] }))
        .pipe(concat('style.min.css'))
        .pipe(scss.sync({ outputStyle: 'compressed' }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream());
};

export const watching = () => {
    watch(['app/scss/style.scss'], styles);
    watch(['app/js/main.js'], scrips);
    watch(['app/html/**/*.html'], html);
    watch(['app/*.html']).on('change', browserSync.reload);
};

export const browserFn = () => {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    });
};

export const building = () => {
    return src([
        'app/css/style.min.css',
        'app/js/main.min.js',
        'app/*.html'
        ], {base: 'app'})
        .pipe(dest('dist'))
}

export const cleanDist = () => {
    return src('dist')
        .pipe(clean())
}

export const build = series(cleanDist, building);

export default parallel(html, styles, scrips, browserFn, watching);
