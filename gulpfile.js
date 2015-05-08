var gulp = require('gulp');
var transpiler = require('gulp-es6-module-transpiler');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var stripCode = require('gulp-strip-code');
var header = require('gulp-header');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');
var bower = require('./bower.json');


// Linters
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');

gulp.task('transpile', function() {
	return gulp.src('packages/loader.e6.js')
		.pipe(transpiler({
			formatter: 'bundle'
		}))
		.pipe(concat('moff.js'))
		.pipe(replace(/\{\{version\}\}/, bower.version))
		.pipe(stripCode({
			start_comment: 'test-code',
			end_comment: 'end-test-code'
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('add-banner', function() {
	var banner = ['/**',
		' * @overview  <%= meta.name %> - <%= meta.description %>',
		' * @author    <%= meta.author %>',
		' * @version   <%= meta.version %>',
		' * @license   <%= meta.license %>',
		' * @copyright <%= meta.copyright %>',
		' */\n'
	].join('\n');

	return gulp.src(['dist/moff.js'])
		.pipe(header(banner, {meta: bower}))
		.pipe(gulp.dest('dist'));
});

gulp.task('minify', function() {
	return gulp.src('packages/loader.e6.js')
		.pipe(sourcemaps.init())
		.pipe(transpiler({
			formatter: 'bundle'
		}))
		.pipe(concat('moff.min.js'))
		.pipe(replace(/\{\{version\}\}/, bower.version))
		.pipe(stripCode({
			start_comment: 'test-code',
			end_comment: 'end-test-code'
		}))
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('dist'));
});

gulp.task('linter', function() {
	return gulp.src('packages/*.js')
		.pipe(jscs({
			esnext: true,
			configPath: '.jscsrc'
		}))
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('test-moff', function() {
	return gulp.src('packages/loader.e6.js')
		.pipe(transpiler({
			formatter: 'bundle'
		}))
		.pipe(concat('moff.dev.js'))
		.pipe(replace(/\{\{version\}\}/, bower.version))
		.pipe(gulp.dest('tests'));
});

gulp.task('compile-tests', function() {
	return gulp.src('tests/unit/**/*.js')
		.pipe(concat('tests.js'))
		.pipe(gulp.dest('tests'));
});

gulp.task('compile', function() {
	runSequence('linter', 'transpile', ['add-banner', 'minify']);
});
gulp.task('test', ['test-moff', 'compile-tests']);