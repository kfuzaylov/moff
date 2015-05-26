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
			Moff.each([1,2,3,4], function(index, value) {
				if (value === 1) {
					expect(index).toEqual(0)
				}

				if (index === 0) {
					expect(value).toEqual(1)
				}

				expect(this).toEqual(value);
			});
		});

		it('goes through object', function() {
			Moff.each({one: 1, two: 2}, function(key, value) {
				if (value === 1) {
					expect(key).toEqual('one')
				}

				if (key === 'one') {
					expect(value).toEqual(1)
				}

				expect(this).toEqual(value);
			});
		});
	});

	describe('Moff.supportCSS3 method', function() {
		it('determines CSS3 property support', function() {
			expect([true, false]).toContain(Moff.supportCSS3('transition'));
		});

		it('does not throw exception for non-existing property', function() {
			expect(Moff.supportCSS3('no-property')).toBe(false);
		});

		it('support CSS2 properties too', function() {
			expect(Moff.supportCSS3('width')).toBe(true);
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

	describe('Moff.extend method', function() {
		beforeAll(function() {
			Moff.extend('tempModule', function() {}, true);
		});

		it('extends Moff object', function() {
			expect(typeof Moff.tempModule).toEqual('object');
		});

		it('extended from Moff object', function() {
			expect(typeof Moff.tempModule.getMode).toEqual('function');
		});
	});

	describe('Moff.reopen method', function() {
		it('adds new methods and properties', function() {
			Moff.reopen({
				newProp: 1,
				newMethod: function() {
					return 1;
				}
			});

			expect(Moff.newProp).toEqual(1);
			expect(typeof Moff.newMethod).toEqual('function');
			expect(Moff.newMethod()).toEqual(1);
		});

		it('overwrites methods and properties', function() {
			Moff.reopen({
				newProp: 3,
				newMethod: function() {
					return 2;
				}
			});

			expect(Moff.newProp).toEqual(3);
			expect(typeof Moff.newMethod).toEqual('function');
			expect(Moff.newMethod()).toEqual(2);
		});
	});

	describe('Moff.extendClass method', function() {
		var childObj;
		function Parent() {
			this.parentMethod = function() {

			};
		}

		function Child() {

		}

		beforeAll(function() {
			Moff.extendClass(Child, Parent);
			childObj = new Child();
		});

		it('extends child constructor from parent', function() {
			expect(typeof childObj.parentMethod).toEqual('function');
		});
	});

	describe('Moff.viewModeIsChanged method', function() {
		it('determines whether view mode is changed', function() {
			expect([false, true]).toContain(Moff.viewModeIsChanged());
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
			var doneFn = jasmine.createSpy("success");

			Moff.ajax({
				type: 'GET',
				url: 'content.html',
				success: function(html) {
					doneFn(html);
				}
			});

			expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');

			jasmine.Ajax.requests.mostRecent().respondWith({
				"status": 200,
				"contentType": 'text/plain',
				"responseText": 'awesome response'
			});

			expect(doneFn).toHaveBeenCalledWith('awesome response');
		});

		it('can can make POST request', function() {
			var doneFn = jasmine.createSpy("success");

			Moff.ajax({
				type: 'POST',
				url: 'content2.html',
				success: function(html) {
					doneFn(html);
				}
			});

			expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');

			jasmine.Ajax.requests.mostRecent().respondWith({
				"status": 200,
				"contentType": 'text/plain',
				"responseText": 'awesome response post'
			});

			expect(doneFn).toHaveBeenCalledWith('awesome response post');
		});
	});
});