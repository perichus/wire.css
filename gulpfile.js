'use strict'

//
// Plugins
//
const gulp = require('gulp')
const gulpLoadPlugins = require('gulp-load-plugins')
const plugins = gulpLoadPlugins()
const sass = require('gulp-sass')(require('sass'))
const autoprefixer = require('gulp-autoprefixer').default
const stripInlineComments = require('postcss-strip-inline-comments')
const groupMediaQueries = require('gulp-group-css-media-queries')
const stripCssComments = require('gulp-strip-css-comments').default
const pkg = require('./package.json')

//
// Paths
//
const path = {
  build: './',
  css: './css',
  js: './js',
  dist: './dist'
}

const source = {
  mainSass: ['src/scss/wire.scss'],
  scss: ['src/scss/**/*.scss'],
  js: ['src/js/*.js']
}

//
// Header
//
const header = ['/**',
  ' * <%= pkg.name %>',
  ' * @version    <%= pkg.version %>',
  ' * @homepage   <%= pkg.homepage %>',
  ' * @author     <%= pkg.author %>',
  ' * @license    Licensed under <%= pkg.license %>',
  ' */',
  ''].join('\n')

//
// Tasks
//
gulp.task('sass', () => {
  return gulp.src(source.scss)
    .pipe(sass())
    .pipe(plugins.plumber({ errorHandler: plugins.notify.onError('Error: <%= error.message %>') }))
    .pipe(gulp.dest(path.dist))
    .pipe(autoprefixer())
    .pipe(stripCssComments())
    .pipe(plugins.header(header, { pkg: pkg }))
    .pipe(gulp.dest(path.dist))
    .pipe(plugins.notify({ message: pkg.name + ' compiled successful. Happy Code!', onLast: true }))
})

gulp.task('distCss', () => {
  return gulp.src(path.dist + '/wire.css')
    .pipe(groupMediaQueries())
    .pipe(plugins.cleanCss())
    .pipe(stripCssComments())
    .pipe(plugins.header(header, { pkg: pkg }))
    .pipe(plugins.rename('wire.min.css'))
    .pipe(gulp.dest(path.dist))
})

gulp.task('distSass', () => {
  return gulp.src(source.mainSass)
    .pipe(plugins.cssimport())
    .pipe(stripCssComments())
    .pipe(plugins.postcss([stripInlineComments], { parser: require('postcss-scss') }))
    .pipe(plugins.header(header, { pkg: pkg }))
    .pipe(plugins.rename('_wire.scss'))
    .pipe(gulp.dest(path.dist))
})

gulp.task('distJs', () => {
  return gulp.src(source.js)
    .pipe(gulp.dest(path.dist))
    .pipe(plugins.uglify())
    .pipe(plugins.plumber({ errorHandler: plugins.notify.onError('Error: <%= error.message %>') }))
    .pipe(plugins.header(header, { pkg: pkg }))
    .pipe(plugins.rename('wire.min.js'))
    .pipe(gulp.dest(path.dist))
})

gulp.task('default', () => {
  gulp.watch(source.scss, gulp.series('sass'))
})

gulp.task('build', gulp.series('sass', 'distCss', 'distSass', 'distJs'))

gulp.task('dev', () => {
  gulp.watch(source.scss, gulp.series('sass', 'distSass', 'distCss'))
  gulp.watch(source.js, gulp.series('distJs'))
})
