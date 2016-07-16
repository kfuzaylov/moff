describe('Moff Core', function() {

	describe('Moff global object', function() {
		it('is initialized', function() {
			expect(typeof window.Moff).toEqual('object');
		});
	});

	describe('Moff.getMode method', function() {
		it('gets current screen mode', function() {
			var mode = Moff.getMode();

			expect(['xs', 'sm', 'md', 'lg']).toContain(mode);
		});
	});

	describe('Moff.settings method', function() {
		it('has getter', function() {
			Moff.settings('cache', true);
			expect(Moff.settings('cache')).toBe(true);
		});

		it('has setter', function() {
			Moff.settings('anySetting', 14);
			var anySetting = Moff.settings('anySetting');

			expect(anySetting).toEqual(14);
		});

		it('setter should return undefined for unregistered key', function() {
			expect(Moff.settings('unregisteredKey')).toBeUndefined();
		});
	});

	describe('Moff.each method', function() {
		it('goes through array', function() {
			Moff.each([1, 2, 3, 4], function(index, value) {
				if (value === 1) {
					expect(index).toEqual(0);
				}

				if (index === 0) {
					expect(value).toEqual(1);
				}

				expect(this).toEqual(value);
			});
		});

		it('goes through object', function() {
			Moff.each({one: 1, two: 2}, function(key, value) {
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

	describe('Moff.runCallbacks method', function() {
		var callbacks = [function(arg1) {
			this[arg1] = true;
		}];
		var object = {};

		beforeAll(function() {
			Moff.runCallbacks(callbacks, object, ['prop']);
		});

		it('runs array of callbacks', function() {
			expect(object.prop).toEqual(true);
		});

		it('normalize its arguments', function() {
			expect(function() {
				Moff.runCallbacks({}, {});
			}).not.toThrow();
		});
	});

	describe('Moff.version property', function() {
		it('returns Moff current version', function() {
			expect(/^\d{1,2}\.\d{1,2}\.\d{1,2}$/.test(Moff.version)).toEqual(true);
		});
	});

	describe('Moff.loadAssets method', function() {
		it('loads bunch js and css files', function(done) {
			Moff.loadAssets({
				js: ['fixtures/depend.js'],
				css: ['fixtures/depend.css']
			}, function() {
				var nodes = document.querySelectorAll('script[src="fixtures/depend.js"], link[href="fixtures/depend.css"]');

				expect(nodes.length).toEqual(2);

				Moff.each(nodes, function() {
					this.parentNode.removeChild(this);
				});
				done();
			});
		});

		it('it reload files if pass {reload: true} option', function(done) {
			Moff.loadAssets({
				js: ['fixtures/depend.js'],
				css: ['fixtures/depend.css']
			}, function() {
				var nodes = document.querySelectorAll('script[src="fixtures/depend.js"], link[href="fixtures/depend.css"]');

				expect(nodes.length).toEqual(2);

				Moff.each(nodes, function() {
					this.parentNode.removeChild(this);
				});
				done();
			}, {reload: true});
		});
	});

	describe('Moff.loadJS method', function() {
		it('loads js file', function(done) {
			Moff.loadJS('fixtures/file.js', function() {
				expect(document.querySelectorAll('script[src="fixtures/file.js"]').length).toEqual(1);
				done();
			});
		});

		it('does not load existing file', function(done) {
			Moff.loadJS('fixtures/file.js', function() {
				expect(document.querySelectorAll('script[src="fixtures/file.js"]').length).toEqual(1);
				done();
			});
		});

		it('reload existing file if pass {reload: true} option', function(done) {
			var file1 = document.querySelector('script[src="fixtures/file.js"]');

			Moff.loadJS('fixtures/file.js', function() {
				expect(document.querySelectorAll('script[src="fixtures/file.js"]').length).toEqual(1);
				var file2 = document.querySelector('script[src="fixtures/file.js"]');

				expect(file1 !== file2).toBe(true);
				done();
			}, {reload: true});
		});
	});

	describe('Moff.loadCSS method', function() {
		it('loads css file', function(done) {
			Moff.loadCSS('fixtures/file.css', function() {
				expect(document.querySelectorAll('link[href="fixtures/file.css"]').length).toEqual(1);
				done();
			});
		});

		it('does not load existing file', function(done) {
			Moff.loadCSS('fixtures/file.css', function() {
				expect(document.querySelectorAll('link[href="fixtures/file.css"]').length).toEqual(1);
				done();
			});
		});

		it('reload existing file if pass {reload: true} option', function(done) {
			var file1 = document.querySelector('link[href="fixtures/file.css"]');

			Moff.loadCSS('fixtures/file.css', function() {
				expect(document.querySelectorAll('link[href="fixtures/file.css"]').length).toEqual(1);
				var file2 = document.querySelector('link[href="fixtures/file.css"]');

				expect(file1 !== file2).toBe(true);
				done();
			}, {reload: true});
		});
	});

	describe('Moff.$ method', function() {
		it('executed function immediately if dom is loaded', function(done) {
			Moff.$(function() {
				expect(true).toBe(true);
				done();
			});
		});
	});

	describe('Moff.ajax method', function() {
		var content;

		beforeEach(function() {
			jasmine.Ajax.install();
		});

		afterEach(function() {
			jasmine.Ajax.uninstall();
		});

		it('can can make GET request', function() {
			var doneFn = jasmine.createSpy('success');

			Moff.ajax({
				type: 'GET',
				url: 'content.html',
				success(html) {
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

		it('can can make POST request', function() {
			var doneFn = jasmine.createSpy('success');

			Moff.ajax({
				type: 'POST',
				url: 'content2.html',
				success(html) {
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

	describe('Moff.showPreloader method', function() {
		it('should be able to add __visible __default class names', function() {
			Moff.showPreloader();

			expect(Moff._testonly._loader().getAttribute('class').match(/__visible/g).length).toEqual(1);
			expect(Moff._testonly._loader().getAttribute('class').match(/__default/g).length).toEqual(1);
		});

		it('should be able to add __visible class names', function() {
			Moff.showPreloader(false);

			expect(Moff._testonly._loader().getAttribute('class').match(/__visible/g).length).toEqual(1);
			expect(Moff._testonly._loader().getAttribute('class').match(/__default/g)).toEqual(null);
		});

		it('adds __visible class name only once', function() {
			Moff.showPreloader();
			Moff.showPreloader();

			expect(Moff._testonly._loader().getAttribute('class').match(/__visible/g).length).toEqual(1);
			expect(Moff._testonly._loader().getAttribute('class').match(/__default/g).length).toEqual(1);
		});
	});

	describe('Moff.hidePreloader method', function() {
		it('should remove __visible class name', function() {
			Moff.hidePreloader();

			expect(Moff._testonly._loader().getAttribute('class').match(/__visible/g)).toEqual(null);
			expect(Moff._testonly._loader().getAttribute('class').match(/__defaulte/g)).toEqual(null);
		});
	});

	describe('Moff.positionPreloader method', function() {
		it('should position preloader in passed coordinates', function() {
			Moff.positionPreloader(200, 290);

			expect(Moff._testonly._loader().getAttribute('style').match(/-webkit-transform: translate\(200px, 290px\);/).length).toEqual(1);
			expect(Moff._testonly._loader().getAttribute('style').match(/-moz-transform: translate\(200px, 290px\);/).length).toEqual(1);
			expect(Moff._testonly._loader().getAttribute('style').match(/-o-transform: translate\(200px, 290px\);/).length).toEqual(1);
			expect(Moff._testonly._loader().getAttribute('style').match(/transform: translate\(200px, 290px\);/).length).toEqual(1);
			expect(Moff._testonly._loader().getAttribute('class').indexOf('__default')).toEqual(-1);
		});
	});

	describe('Moff.addClass method', function() {
		it('should add one or several class name to element', function() {
			var div = document.createElement('div');

			Moff.addClass(div, 'one');
			expect(div.className).toEqual('one');

			Moff.addClass(div, 'three four');
			expect(/three/.test(div.className)).toBe(true);
			expect(/four/.test(div.className)).toBe(true);
		});

		it('should not add the same class twice', function() {
			var div = document.createElement('div');

			Moff.addClass(div, 'one one');
			expect(div.className).toEqual('one');
		});
	});

	describe('Moff.removeClass method', function() {
		it('should remove one or several class name of element', function() {
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
