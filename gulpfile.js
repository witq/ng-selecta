'use strict';

const pkg = require('./package.json');
const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const header = require('gulp-header');
const jshint = require('gulp-jshint');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const livereload = require('gulp-livereload');
const ngAnnotate = require('gulp-ng-annotate');
const del = require('del');
const karma = require('karma').server;
const karmaConfig = {
  dev: require('./config/karma-dev.conf'),
  ci: require('./config/karma-ci.conf')
};

const banner = ['/*!',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  '', ''].join('\n');
const paths = {
  base: './src/',
  src: './src/**/*.js',
  test: [
    './src/**/*.js',
    './test/spec/**/*.js'
  ],
  dist: './dist/'
};

gulp.task('lint', function () {
  return gulp
    .src(paths.src)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('clean', function (next) {
  return del([
    paths.dist + '**/*.js'
  ], next);
});

gulp.task('copy', ['clean'], function () {
  return gulp
    .src(paths.src, {
      base: paths.base
    })
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(header(banner, {pkg: pkg}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('minify', ['lint', 'clean'], function () {
  return gulp
    .src(paths.src)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(plumber())
    .pipe(ngAnnotate({
      single_quotes: true
    }))
    .pipe(uglify({
      preserveComments: 'some'
    }))
    .pipe(rename(function (path) {
      path.extname = '.min.js';
    }))
    .pipe(header(banner, {pkg: pkg}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('watch', function () {

  livereload.listen();

  gulp
    .watch(paths.test, ['test']);

  gulp
    .watch(paths.src, ['build']);

  gulp
    .watch(paths.dist)
    .on('change', livereload.changed);

});

gulp.task('build', ['minify', 'copy']);
gulp.task('default', ['build', 'watch']);

gulp.task('test', ['build'], function (next) {
  karma.start(karmaConfig.dev, next);
});

gulp.task('ci', ['build'], function (next) {
  karma.start(karmaConfig.ci, next);
});