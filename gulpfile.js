'use strict';

//
// Plugins
//
var gulp    = require('gulp');
var sass    = require('gulp-sass');
var header  = require('gulp-header');
var notify  = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var pkg     = require('./package.json');

//
// Paths
//
var path = {
    build   : './',
    css     : './css',
    dist    : './dist',
    cssDist : './dist/css'
};

var source = {
    //TODO: Add path to js
    // js      : [],
    scss    : [ 'scss/wire/base/*.scss',
                'scss/wire/components/*.scss',
                'scss/wire/tools/*.scss',
                'scss/wire/*.scss' ]
};

var banner = ['/**',
  ' * <%= pkg.name %>',
  ' * @version    v<%= pkg.version %>',
  ' * @homepage   <%= pkg.homepage %>',
  ' * @author     <%= pkg.author %>',
  ' * @license    Licensed under <%= pkg.license %>',
  ' */',
  ''].join('\n');


gulp.task('sass', function() {
    gulp.src('scss/wire/**/*.scss')
        .pipe(sass())
        .on('error', function (err) { console.log(err.message); })
        .pipe(gulp.dest('./dist/css'))
        .pipe(autoprefixer({ browsers: ['IE 8', 'IE 9', 'Firefox 14', 'last 5 versions', 'Opera 11.1', 'Android 2.2'] }))
        .pipe(gulp.dest(path.cssDist))
        .pipe(minifyCSS())
        .pipe(header(banner, {pkg: pkg}))
        .pipe(rename('wire.min.css'))
        .pipe(gulp.dest(path.cssDist))
        .pipe(notify({ message: pkg.name + ' compiled successful. Happy Code!' , onLast: true}));
});

gulp.task('default', function() {
    gulp.watch(source.scss, ['sass']);
});