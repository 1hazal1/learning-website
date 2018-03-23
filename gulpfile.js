// -------------------------
// REQUIRED PLUGINS
// -------------------------
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var webpack = require ('webpack');
var gulpWebpack = require('webpack-stream');
var shell = require('gulp-shell');


// -------------------------
// CONFIGURATION
// -------------------------
var src = 'src/';
var dest = 'dist/';

srcPath = {
    css: src + 'css',
    fonts: src + 'fonts',
    img: src + 'img',
    js: src + 'js',
    scss: src + 'scss',
    video: src + 'video',
    json: src + 'json',
}

destPath = {
    css: dest + 'css',
    fonts: dest + 'fonts',
    img: dest + 'img',
    js: dest + 'js',
    video: dest + 'video',
    json: dest + 'json',
}

files = {
    scss: srcPath.scss + '/**/*.scss',
    css: srcPath.css + '/**/*.css',
    html: src + '*.html',
    img: srcPath.img + '/**/*.+(png|jpg|gif|svg|jpeg)',
    js: srcPath.js + '/*.js',
    fonts: srcPath.fonts + '/**/*',
    bootstrap: 'src/scss/vendor/bootstrap-sass/stylesheets/*.scss',
    video: srcPath.video + '/**/*',
    json: srcPath.json + '/**/*'
}



// -------------------------
//  TASKS
// -------------------------

// SASS Compiling
gulp.task('sass', function () {
    return gulp.src(files.scss)
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest(srcPath.css))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano())
        .pipe(gulp.dest(destPath.css))
        .pipe(browserSync.reload({ stream: true }))
});

// Watch task
gulp.task('watch', function () {
    gulp.watch(files.scss, ['sass']);
    gulp.watch(files.html, ['html', browserSync.reload]);
    gulp.watch(files.js, ['webpack', browserSync.reload]);
    gulp.watch(files.json, ['json', browserSync.reload]);
});

// Browser Sync
gulp.task('browserSync:dist', function () {
    browserSync.init({
        server: {
            baseDir: dest
        },
    })
});

// Webpack
// gulp.task('webpack', shell.task([
//     "webpack"
// ]));

// Optimizing images
gulp.task('images', function () {
    return gulp.src(files.img)
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest(destPath.img))
});

// Copying videos
gulp.task('video', function () {
    gulp.src(files.video)
        .pipe(gulp.dest(destPath.video));
})

// Copying html files
gulp.task('html', function () {
    return gulp.src(files.html)
        .pipe(gulp.dest(dest))
})

// Copying fonts to dist
gulp.task('fonts', function () {
    return gulp.src(files.fonts)
        .pipe(gulp.dest(destPath.fonts))
})

//Copying jsons to dist
gulp.task('json', function() {
    return gulp.src(files.json)
        .pipe(gulp.dest(destPath.json))
})

// Cleaning
gulp.task('clean', function () {
    return del.sync(dest);
})


// -------------------------
// COMBINING TASKS
// -------------------------

gulp.task('default', function (callback) {
    runSequence('clean', ['sass'], ['html', 'images', 'video', 'fonts', 'json'], 'browserSync:dist', 'watch',
        callback
    )
})