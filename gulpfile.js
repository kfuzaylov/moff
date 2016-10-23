var gulp = require('gulp');
var critical = require('critical');

var pages = [
	'index.src.html',
	'api/index.src.html',
	'api/amd.src.html',
	'api/detect.src.html',
	'api/modules.src.html',
	'api/module.src.html',
	'api/event.src.html'
];

var pages2 = [
	'blog/index.src.html',
	'blog/moff-and-modulated-bootstrap.src.html',
	'blog/start-with-mobile-first-website.src.html',
	'blog/why-mobile-first.src.html'
];

var pages3 = [
	'tutorial/amd.src.html',
	'tutorial/data-events.src.html',
	'tutorial/getting-started.src.html',
	'tutorial/modularity.src.html',
	'tutorial/modulated-bootstrap.src.html',
	'moff-cli/index.src.html'
];

// Generate & Inline Critical-path CSS
gulp.task('pages', function () {
	pages.forEach(function(page) {
		critical.generate({
			base: './',
			src: page,
			minify: true,
			width: 1920,
			height: 980,
			inline: true,
			dest: page.replace('src.', '')
		});
	});
});

gulp.task('pages2', function () {
	pages2.forEach(function(page) {
		critical.generate({
			base: './',
			src: page,
			minify: true,
			width: 1920,
			height: 980,
			inline: true,
			dest: page.replace('src.', '')
		});
	});
});

gulp.task('pages3', function () {
	pages3.forEach(function(page) {
		critical.generate({
			base: './',
			src: page,
			minify: true,
			width: 1920,
			height: 980,
			inline: true,
			dest: page.replace('src.', '')
		});
	});
});