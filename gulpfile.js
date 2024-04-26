//https://www.youtube.com/watch?v=Hh1aDoWMJXA

const { src, dest, watch, parallel, series } = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default; // это сжимает js gulp
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');
const avif = require('gulp-avif');//картинки
const webp = require('gulp-webp');//картинки
const imagemin = require('gulp-imagemin');//картинки
const newer = require('gulp-newer');//картинки
const fonter = require('gulp-fonter');//шрифты
const ttf2woff2 = require('gulp-ttf2woff2');
const svgSprite = require('gulp-svg-sprite');
const include = require('gulp-include'); //инклюд html

function pages() {
    return src('app/pages/*.html')
        .pipe(include({
            includePaths: 'app/components'
        }))
        .pipe(dest('app'))
        .pipe(browserSync.stream())
}

function fonts() {
    return src('app/fonts/src/*.*')
        .pipe(fonter({
            formats: ['woff', 'ttf']
        }))
        .pipe(src('app/fonts/*.ttf'))
        .pipe(ttf2woff2())
        .pipe(dest('app/fonts'))
}

function sprite() {
    return src('app/img/*.svg')
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: '../sprite.svg',
                    example: true
                }
            }
        }))
        .pipe(dest('app/img'))
}

/*
форматирует и сжимает
*/
function images() {
    return src(['app/img/src/*.*', '!app/img/src/*.svg'])
        .pipe(newer('app/img'))
        .pipe(avif({ quality: 50 }))

        .pipe(src('app/img/src/*.*'))
        .pipe(newer('app/img'))
        .pipe(webp())

        .pipe(src('app/img/src/*.*'))
        .pipe(newer('app/img'))
        .pipe(imagemin())

        .pipe(dest('app/img'))
}


function styles() {
    return src('app/scss/style.scss')
        .pipe(concat('style.min.css'))
        .pipe(scss({ outputStyle: 'compressed' }))
        .pipe(dest('app/css')) //сохранись в папку
        .pipe(browserSync.stream())
}

function scripts() {
    //в return подключаем пути ко всем js файлам нашим, main мы сами пишем, свайпер подключили через npm, если будем подключить миллион файлов, все прописываем зддесь
    return src(['app/js/*.js', '!app/js/main.min.js'])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}

//следит за обновлениями кода и запускает ф-ции скрипт и styles images
function watching() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
    watch(['app/scss/style.scss'], styles)
    watch(['app/img/src'], images)
    watch(['app/js/main.js'], scripts)
    watch(['app/components/*', 'app/pages/*'], pages)
    watch(['app/*.html']).on('change', browserSync.reload)
}


function cleanDist() {
    return src('dist')
        .pipe(clean())
}

function building() {
    return src([
        'app/css/style.min.css',
        'app/img/*.*',
        '!app/img/*.svg',
        '!app/stack',
        // 'app/img/sprite.svg',
        'app/fonts/*.*',
        'app/js/main.min.js',
        'app/**/*.html'
    ], { base: 'app' })
        .pipe(dest('dist'))
}

exports.styles = styles;
exports.images = images;
exports.sprite = sprite;
exports.scripts = scripts;
exports.pages = pages;
exports.fonts = fonts;
exports.watching = watching;
exports.building = building;
exports.cleanDist = cleanDist;
exports.build = series(cleanDist, building);

exports.default = parallel(styles, images, scripts, pages, watching);