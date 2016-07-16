var gulp = require('gulp');
var bower = require('./bower.json');

var babelify = require('babelify');
var browserify = require('browserify');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var concat = require('gulp-concat');
var stripCode = require('gulp-strip-code');
var header = require('gulp-header');
var replace = require('gulp-replace');

var source = require('vinyl-source-stream2');
var rename = require('gulp-rename');

var argv = require('yargs').argv;
var Testem = require('testem');

var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');

var sass = require('gulp-sass');
var glob = require('glob');

gulp.task('compile', ['lint', 'bootstrap'], function() {
	var banner = ['/**',
		' * @overview  <%= meta.name %> - <%= meta.description %>',
		' * @author    <%= meta.author %>',
		' * @version   <%= meta.version %>',
		' * @license   <%= meta.license %>',
		' * @copyright <%= meta.copyright %>',
		' */\n'
	].join('\n');

	browserify({entries: './packages/loader/src/loader.e6.js'})
		.transform(babelify)
		.bundle()
		.pipe(source('./packages/loader/src/loader.e6.js'))
		.pipe(replace(/\{\{version\}\}/, bower.version))
		.pipe(header(banner, {meta: bower}))
		.pipe(rename('moff.js'))
		.pipe(gulp.dest('dist'));

	browserify({entries: './packages/loader/src/loader.e6.js'})
		.transform(babelify)
		.bundle()
		.pipe(source('./packages/loader/src/loader.e6.js'))
		.pipe(replace(/\{\{version\}\}/, bower.version))
		.pipe(replace(/Moff\.debug\(.+?\);/gm, ''))
		.pipe(replace(/^[\s\t]*[\r\n]/gm, ''))
		.pipe(header(banner, {meta: bower}))
		.pipe(stripCode({
			start_comment: 'Test-code',
			end_comment: 'End-test-code'
		}))
		.pipe(sourcemaps.init())
		.pipe(rename('moff.prod.js'))
		.pipe(gulp.dest('dist'))
		.pipe(rename('moff.min.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('dist'));

});

gulp.task('lint', function() {
	return gulp.src('packages/*.js')
		.pipe(jscs({
			esnext: true,
			configPath: '.jscsrc'
		}))
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('test', ['compile'], function() {
	var filename = `${Date.now()}.json`;

	gulp.src('.testem.json')
		.pipe(replace('gulp test', `gulp compile-tests --package=${argv.package}`))
		.pipe(replace('rm %filename%', `rm ${filename}`))
		.pipe(rename(filename))
		.pipe(gulp.dest('./'));

	setTimeout(function() {
		var server = new Testem();

		server.startDev({file: filename});
	}, 500);
});

gulp.task('compile-tests', function() {
	var path = '**';

	if (argv.package) {
		path = argv.package === 'all' ? '**' : argv.package;
	}

	glob(`packages/${path}/tests/*.js`, function(error, files) {
		browserify(files)
			.transform(babelify)
			.bundle()
			.pipe(source(`packages/${path}/tests/*.js`))
			.pipe(rename('tests.js'))
			.pipe(gulp.dest('tests'));
	});
});

gulp.task('bootstrap', ['bootstrap-scss', 'bootstrap-js', 'bootstrap-fonts']);

gulp.task('bootstrap-scss', function() {
	return gulp.src(['packages/bootstrap/**/*.scss', '!packages/bootstrap/dependency.scss'])
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(gulp.dest('dist/bootstrap'));
});

gulp.task('bootstrap-js', function() {
	return gulp.src('packages/bootstrap/javascripts/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/bootstrap/javascripts'));
});

gulp.task('bootstrap-fonts', function() {
	return gulp.src('packages/bootstrap/fonts/bootstrap/*.*')
		.pipe(gulp.dest('dist/bootstrap/fonts/bootstrap'));
});
