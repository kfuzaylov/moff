(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

describe('Moff Core', function () {

	describe('Moff global object', function () {
		it('is initialized', function () {
			expect(_typeof(window.Moff)).toEqual('object');
		});
	});

	describe('Moff.getMode method', function () {
		it('gets current screen mode', function () {
			var mode = Moff.getMode();

			expect(['xs', 'sm', 'md', 'lg']).toContain(mode);
		});
	});

	describe('Moff.settings method', function () {
		it('has getter', function () {
			Moff.settings('cache', true);
			expect(Moff.settings('cache')).toBe(true);
		});

		it('has setter', function () {
			Moff.settings('anySetting', 14);
			var anySetting = Moff.settings('anySetting');

			expect(anySetting).toEqual(14);
		});

		it('setter should return undefined for unregistered key', function () {
			expect(Moff.settings('unregisteredKey')).toBeUndefined();
		});
	});

	describe('Moff.each method', function () {
		it('goes through array', function () {
			Moff.each([1, 2, 3, 4], function (index, value) {
				if (value === 1) {
					expect(index).toEqual(0);
				}

				if (index === 0) {
					expect(value).toEqual(1);
				}

				expect(this).toEqual(value);
			});
		});

		it('goes through object', function () {
			Moff.each({ one: 1, two: 2 }, function (key, value) {
				if (value === 1) {
					expect(key).toEqual('one');
				}

				if (key === 'one') {
					expect(value).toEqual(1);
				}

				expect(this).toEqual(value);
			});
		});
	});

	describe('Moff.runCallbacks method', function () {
		var callbacks = [function (arg1) {
			this[arg1] = true;
		}];
		var object = {};

		beforeAll(function () {
			Moff.runCallbacks(callbacks, object, ['prop']);
		});

		it('runs array of callbacks', function () {
			expect(object.prop).toEqual(true);
		});

		it('normalize its arguments', function () {
			expect(function () {
				Moff.runCallbacks({}, {});
			}).not.toThrow();
		});
	});

	describe('Moff.version property', function () {
		it('returns Moff current version', function () {
			expect(/^\d{1,2}\.\d{1,2}\.\d{1,2}$/.test(Moff.version)).toEqual(true);
		});
	});

	describe('Moff.loadAssets method', function () {
		it('loads bunch js and css files', function (done) {
			Moff.loadAssets({
				js: ['fixtures/depend.js'],
				css: ['fixtures/depend.css']
			}, function () {
				var nodes = document.querySelectorAll('script[src="fixtures/depend.js"], link[href="fixtures/depend.css"]');

				expect(nodes.length).toEqual(2);

				Moff.each(nodes, function () {
					this.parentNode.removeChild(this);
				});
				done();
			});
		});

		it('it reload files if pass {reload: true} option', function (done) {
			Moff.loadAssets({
				js: ['fixtures/depend.js'],
				css: ['fixtures/depend.css']
			}, function () {
				var nodes = document.querySelectorAll('script[src="fixtures/depend.js"], link[href="fixtures/depend.css"]');

				expect(nodes.length).toEqual(2);

				Moff.each(nodes, function () {
					this.parentNode.removeChild(this);
				});
				done();
			}, { reload: true });
		});
	});

	describe('Moff.loadJS method', function () {
		it('loads js file', function (done) {
			Moff.loadJS('fixtures/file.js', function () {
				expect(document.querySelectorAll('script[src="fixtures/file.js"]').length).toEqual(1);
				done();
			});
		});

		it('does not load existing file', function (done) {
			Moff.loadJS('fixtures/file.js', function () {
				expect(document.querySelectorAll('script[src="fixtures/file.js"]').length).toEqual(1);
				done();
			});
		});

		it('reload existing file if pass {reload: true} option', function (done) {
			var file1 = document.querySelector('script[src="fixtures/file.js"]');

			Moff.loadJS('fixtures/file.js', function () {
				expect(document.querySelectorAll('script[src="fixtures/file.js"]').length).toEqual(1);
				var file2 = document.querySelector('script[src="fixtures/file.js"]');

				expect(file1 !== file2).toBe(true);
				done();
			}, { reload: true });
		});
	});

	describe('Moff.loadCSS method', function () {
		it('loads css file', function (done) {
			Moff.loadCSS('fixtures/file.css', function () {
				expect(document.querySelectorAll('link[href="fixtures/file.css"]').length).toEqual(1);
				done();
			});
		});

		it('does not load existing file', function (done) {
			Moff.loadCSS('fixtures/file.css', function () {
				expect(document.querySelectorAll('link[href="fixtures/file.css"]').length).toEqual(1);
				done();
			});
		});

		it('reload existing file if pass {reload: true} option', function (done) {
			var file1 = document.querySelector('link[href="fixtures/file.css"]');

			Moff.loadCSS('fixtures/file.css', function () {
				expect(document.querySelectorAll('link[href="fixtures/file.css"]').length).toEqual(1);
				var file2 = document.querySelector('link[href="fixtures/file.css"]');

				expect(file1 !== file2).toBe(true);
				done();
			}, { reload: true });
		});
	});

	describe('Moff.$ method', function () {
		it('executed function immediately if dom is loaded', function (done) {
			Moff.$(function () {
				expect(true).toBe(true);
				done();
			});
		});
	});

	describe('Moff.ajax method', function () {
		var content;

		beforeEach(function () {
			jasmine.Ajax.install();
		});

		afterEach(function () {
			jasmine.Ajax.uninstall();
		});

		it('can can make GET request', function () {
			var doneFn = jasmine.createSpy('success');

			Moff.ajax({
				type: 'GET',
				url: 'content.html',
				success: function success(html) {
					doneFn(html);
				}
			});

			expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');

			jasmine.Ajax.requests.mostRecent().respondWith({
				status: 200,
				contentType: 'text/plain',
				responseText: 'awesome response'
			});

			expect(doneFn).toHaveBeenCalledWith('awesome response');
		});

		it('can can make POST request', function () {
			var doneFn = jasmine.createSpy('success');

			Moff.ajax({
				type: 'POST',
				url: 'content2.html',
				success: function success(html) {
					doneFn(html);
				}
			});

			expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');

			jasmine.Ajax.requests.mostRecent().respondWith({
				status: 200,
				contentType: 'text/plain',
				responseText: 'awesome response post'
			});

			expect(doneFn).toHaveBeenCalledWith('awesome response post');
		});
	});

	describe('Moff.showPreloader method', function () {
		it('should be able to add __visible __default class names', function () {
			Moff.showPreloader();

			expect(Moff._testonly._loader().getAttribute('class').match(/__visible/g).length).toEqual(1);
			expect(Moff._testonly._loader().getAttribute('class').match(/__default/g).length).toEqual(1);
		});

		it('should be able to add __visible class names', function () {
			Moff.showPreloader(false);

			expect(Moff._testonly._loader().getAttribute('class').match(/__visible/g).length).toEqual(1);
			expect(Moff._testonly._loader().getAttribute('class').match(/__default/g)).toEqual(null);
		});

		it('adds __visible class name only once', function () {
			Moff.showPreloader();
			Moff.showPreloader();

			expect(Moff._testonly._loader().getAttribute('class').match(/__visible/g).length).toEqual(1);
			expect(Moff._testonly._loader().getAttribute('class').match(/__default/g).length).toEqual(1);
		});
	});

	describe('Moff.hidePreloader method', function () {
		it('should remove __visible class name', function () {
			Moff.hidePreloader();

			expect(Moff._testonly._loader().getAttribute('class').match(/__visible/g)).toEqual(null);
			expect(Moff._testonly._loader().getAttribute('class').match(/__defaulte/g)).toEqual(null);
		});
	});

	describe('Moff.positionPreloader method', function () {
		it('should position preloader in passed coordinates', function () {
			Moff.positionPreloader(200, 290);

			expect(Moff._testonly._loader().getAttribute('style').match(/-webkit-transform: translate\(200px, 290px\);/).length).toEqual(1);
			expect(Moff._testonly._loader().getAttribute('style').match(/-moz-transform: translate\(200px, 290px\);/).length).toEqual(1);
			expect(Moff._testonly._loader().getAttribute('style').match(/-o-transform: translate\(200px, 290px\);/).length).toEqual(1);
			expect(Moff._testonly._loader().getAttribute('style').match(/transform: translate\(200px, 290px\);/).length).toEqual(1);
			expect(Moff._testonly._loader().getAttribute('class').indexOf('__default')).toEqual(-1);
		});
	});

	describe('Moff.addClass method', function () {
		it('should add one or several class name to element', function () {
			var div = document.createElement('div');

			Moff.addClass(div, 'one');
			expect(div.className).toEqual('one');

			Moff.addClass(div, 'three four');
			expect(/three/.test(div.className)).toBe(true);
			expect(/four/.test(div.className)).toBe(true);
		});

		it('should not add the same class twice', function () {
			var div = document.createElement('div');

			Moff.addClass(div, 'one one');
			expect(div.className).toEqual('one');
		});
	});

	describe('Moff.removeClass method', function () {
		it('should remove one or several class name of element', function () {
			var div = document.createElement('div');

			Moff.addClass(div, 'one two');
			Moff.removeClass(div, 'two');
			expect(div.className).toEqual('one');

			Moff.addClass(div, 'three four');
			Moff.removeClass(div, 'one four');
			expect(div.className).toEqual('three');
		});
	});
});

},{}],2:[function(require,module,exports){
'use strict';

describe('Data events', function () {

	describe('data-load-target', function () {
		var beforeLoad, afterLoad;

		beforeAll(function () {
			Moff.settings('loadOnHover', true);
			var a = document.createElement('a');
			var div = document.createElement('div');

			a.innerHTML = 'Load content click';
			a.href = 'content33.html';
			a.setAttribute('data-load-target', '#content_target');
			a.id = 'load_target';

			div.id = 'content_target';

			document.body.appendChild(a);
			document.body.appendChild(div);

			Moff.handleDataEvents();

			Moff.beforeLoad(function () {
				beforeLoad = true;
			});

			Moff.afterLoad(function () {
				afterLoad = true;
			});
		});

		afterAll(function () {
			Moff.each(document.querySelectorAll('#content_target, #load_target'), function () {
				this.parentNode.removeChild(this);
			});
		});

		afterEach(function () {
			jasmine.Ajax.uninstall();
		});

		it('specifies target content to be loaded in', function () {
			jasmine.Ajax.withMock(function () {
				var event = document.createEvent('Event');

				event.initEvent('click', true, true);

				document.querySelector('#load_target').dispatchEvent(event);

				jasmine.Ajax.requests.mostRecent().respondWith({
					status: 200,
					contentType: 'text/plain',
					responseText: 'hello'
				});

				expect(document.querySelector('#content_target').innerHTML).toEqual('hello');
			});
		});

		it('has beforeLoad callback', function () {
			expect(beforeLoad).toBe(true);
		});

		it('has afterLoad callback', function () {
			expect(afterLoad).toBe(true);
		});

		it('can preload data on hover event', function () {
			Moff.each(document.querySelectorAll('#content_target, #load_target'), function () {
				this.parentNode.removeChild(this);
			});

			jasmine.Ajax.withMock(function () {

				var a = document.createElement('a');
				var div = document.createElement('div');

				a.href = 'content-preload.html';
				a.setAttribute('data-load-target', '#content_target');
				a.innerHTML = 'Load content click';
				a.id = 'load_target';

				div.id = 'content_target';

				document.body.appendChild(a);
				document.body.appendChild(div);

				Moff.handleDataEvents();

				var event = document.createEvent('Event');

				event.initEvent('mouseenter', true, true);

				document.querySelector('#load_target').dispatchEvent(event);

				jasmine.Ajax.requests.mostRecent().respondWith({
					status: 200,
					contentType: 'text/plain',
					responseText: 'hello'
				});

				expect(Moff._testonly._cache[a.href]).toEqual('hello');
			});
		});

		it('should clear cache each n seconds', function (done) {
			setTimeout(function () {
				expect(Object.keys(Moff._testonly._cache).length).toEqual(0);
				done();
			}, Moff.settings('cacheLiveTime'));
		});
	});

	describe('data-load-url', function () {
		beforeAll(function () {
			var span = document.createElement('span');
			var div = document.createElement('div');

			span.id = 'load_target';
			span.setAttribute('data-load-url', 'content2.html');
			span.setAttribute('data-load-target', '#content_target');
			span.innerHTML = 'Load content url';

			div.id = 'content_target';
			document.body.appendChild(div);
			document.body.appendChild(span);
			Moff.handleDataEvents();
		});

		afterAll(function () {
			Moff.each(document.querySelectorAll('#content_target, #load_target'), function () {
				this.parentNode.removeChild(this);
			});
		});

		it('sets load url for an element', function () {
			jasmine.Ajax.withMock(function () {
				var event = document.createEvent('Event');

				event.initEvent('click', true, true);
				document.querySelector('#load_target').dispatchEvent(event);

				jasmine.Ajax.requests.mostRecent().respondWith({
					status: 200,
					contentType: 'text/plain',
					responseText: 'dom loaded'
				});

				expect(document.querySelector('#content_target').innerHTML).toEqual('dom loaded');
			});
		});
	});

	describe('data-page-title', function () {
		beforeAll(function () {
			var a = document.createElement('a');
			var div = document.createElement('div');

			a.href = 'content.html';
			a.id = 'load_target';
			a.innerHTML = 'Page title';
			a.setAttribute('data-load-target', '#content_target');
			a.setAttribute('data-page-title', 'New Title');

			div.id = 'content_target';

			document.body.appendChild(a);
			document.body.appendChild(div);

			Moff.handleDataEvents();
		});

		afterAll(function () {
			Moff.each(document.querySelectorAll('#content_target, #load_target'), function () {
				this.parentNode.removeChild(this);
			});
		});

		it('changes document title', function () {
			jasmine.Ajax.withMock(function () {
				var event = document.createEvent('Event');

				event.initEvent('click', true, true);
				document.querySelector('#load_target').dispatchEvent(event);

				jasmine.Ajax.requests.mostRecent().respondWith({
					status: 200,
					contentType: 'text/plain',
					responseText: ''
				});

				expect(document.title).toEqual('New Title');
			});
		});
	});

	describe('data-load-screen', function () {
		beforeAll(function () {
			var a = document.createElement('a');
			var div = document.createElement('div');

			a.href = 'content-screen.html';
			a.id = 'load_target';
			a.innerHTML = 'Load by screen';
			a.setAttribute('data-load-target', '#content_target');
			a.setAttribute('data-load-screen', 'xs sm md lg');

			div.id = 'content_target';

			document.body.appendChild(a);
			document.body.appendChild(div);
		});

		afterAll(function () {
			Moff.each(document.querySelectorAll('#content_target, #load_target'), function () {
				this.parentNode.removeChild(this);
			});
		});

		it('automatically loads by screen size', function () {
			jasmine.Ajax.withMock(function () {
				Moff.handleDataEvents();

				jasmine.Ajax.requests.mostRecent().respondWith({
					status: 200,
					contentType: 'text/plain',
					responseText: 'screen content'
				});

				expect(document.querySelector('#content_target').innerHTML).toEqual('screen content');
			});
		});
	});

	describe('data-load-module', function () {
		beforeAll(function () {
			Moff.amd.register({
				id: 'data-module'
			});

			var a = document.createElement('a');
			var div = document.createElement('div');

			a.href = 'content-screen.html';
			a.id = 'load_target';
			a.innerHTML = 'Load by screen';
			a.setAttribute('data-load-target', '#content_target');
			a.setAttribute('data-load-screen', 'xs sm md lg');
			a.setAttribute('data-load-module', 'data-module');

			div.id = 'content_target';

			document.body.appendChild(a);
			document.body.appendChild(div);
		});

		afterAll(function () {
			Moff.each(document.querySelectorAll('#content_target, #load_target'), function () {
				this.parentNode.removeChild(this);
			});
		});

		it('automatically loads register after content', function () {
			jasmine.Ajax.withMock(function () {
				Moff.handleDataEvents();

				jasmine.Ajax.requests.mostRecent().respondWith({
					status: 200,
					contentType: 'text/plain',
					responseText: ''
				});

				expect(Moff.amd._testonly._registeredFiles['data-module'].loaded).toBe(true);
			});
		});
	});
});

},{}]},{},[1,2]);
