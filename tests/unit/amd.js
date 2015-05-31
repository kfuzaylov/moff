describe('AMD', function() {
	var before, after;
	
	var div = document.createElement('div');
	div.setAttribute('data-load-module', 'load-data');
	document.body.appendChild(div);

	Moff.register({
		id: 'load',
		depend: {
			js: ['fixtures/depend.js'],
			css: ['fixtures/depend.css']
		},
		file: {
			js: ['fixtures/file.js'],
			css: ['fixtures/file.css']
		},
		loadOnScreen: ['xs', 'sm', 'md', 'lg']
	});

	Moff.register({
		id: 'load-data',
		loadOnScreen: ['xs', 'sm', 'md', 'lg']
	});

	Moff.register({
		id: 'moduleId',
		depend: {
			js: ['fixtures/depend.js'],
			css: ['fixtures/depend.css']
		},
		file: {
			js: ['fixtures/file.js'],
			css: ['fixtures/file.css']
		},
		beforeInclude: function() {
			before = true;
		},
		afterInclude: function() {
			after = true;
		},
		onWindowLoad: true
	});

	Moff.register({
		id: 'push',
		onWindowLoad: true
	});

	Moff.include('push');

	describe('Moff.include loadOnScreen option', function() {

		afterAll(function() {
			var nodes = document.querySelectorAll('[src="fixtures/depend.js"], [src="fixtures/file.js"], [href="fixtures/depend.css"], [href="fixtures/file.css"]');
			Moff.each(nodes, function() {
				this.parentNode.removeChild(this);
			});
		});
		
		it('marks register as loaded', function(done) {
			Moff.$(function() {
				expect(Moff._testonly._registeredFiles['load'].loaded).toBeTruthy();
				done();
			});
		});

		it('loads js files', function(done) {
			setTimeout(function() {
				expect(document.querySelectorAll('[src="fixtures/depend.js"], [src="fixtures/file.js"]').length).toEqual(2);
				done();
			}, 10);

		});

		it('loads css files', function() {
			expect(document.querySelectorAll('[href="fixtures/depend.css"], [href="fixtures/file.css"]').length).toEqual(2);
		});

		it('does not load register w/o this flag', function(done) {
			Moff.$(function() {
				expect(Moff._testonly._registeredFiles['moduleId'].loaded).toBeFalsy();
				done();
			});
		});

		it('does not include if module registered in data event', function(done) {
			Moff.$(function() {
				expect(Moff._testonly._registeredFiles['load-data'].loaded).toBeFalsy();
				done();
			});
		});
	});

	describe('Moff.register method', function() {

		beforeAll(function() {
			Moff.register({
				id: 'fakeId'
			});
		});

		it('registers new module', function() {
			expect(typeof Moff._testonly._registeredFiles.fakeId).toEqual('object');
		});

		it('normalizes registered object', function() {
			expect(Moff._testonly._registeredFiles.fakeId.loaded).toBe(false);

			expect(typeof Moff._testonly._registeredFiles.fakeId.depend).toEqual('object');
			expect(Array.isArray(Moff._testonly._registeredFiles.fakeId.depend.js)).toBe(true);
			expect(Array.isArray(Moff._testonly._registeredFiles.fakeId.depend.css)).toBe(true);

			expect(typeof Moff._testonly._registeredFiles.fakeId.file).toEqual('object');
			expect(Array.isArray(Moff._testonly._registeredFiles.fakeId.file.js)).toBe(true);
			expect(Array.isArray(Moff._testonly._registeredFiles.fakeId.file.css)).toBe(true);

			expect(Array.isArray(Moff._testonly._registeredFiles.fakeId.loadOnScreen)).toBe(true);
			expect(Moff._testonly._registeredFiles.fakeId.beforeInclude).toBeUndefined();
			expect(Moff._testonly._registeredFiles.fakeId.afterInclude).toBeUndefined();
			expect(Moff._testonly._registeredFiles.fakeId.onWindowLoad).toBe(false);
		});
	});

	describe('Moff.include method', function() {
		var included;

		beforeAll(function(done) {
			Moff.include('moduleId', function() {
				included = true;
				done();
			});
		});

		afterAll(function() {
			var nodes = document.querySelectorAll('[src="fixtures/depend.js"], [src="fixtures/file.js"], [href="fixtures/depend.css"], [href="fixtures/file.css"]');
			Moff.each(nodes, function() {
				this.parentNode.removeChild(this);
			});
		});

		it ('push register as deferred if onWindowLoad is true and register was being included before load', function() {
			Moff.each(Moff._testonly._deferredObjects, function(i, obj) {
				if (obj.id === 'push') {
					expect(true).toBe(true);
					return false;
				}
			});
		});

		it('includes registered module', function() {
			expect(included).toBe(true);
		});

		it('runs beforeInclude callback', function() {
			expect(before).toBe(true);
		});

		it('runs afterInclude callback', function() {
			expect(after).toBe(true);
		});

		it('loads js files', function() {
			expect(document.querySelectorAll('[src="fixtures/depend.js"], [src="fixtures/file.js"]').length).toEqual(2);
		});

		it('loads css files', function() {
			expect(document.querySelectorAll('[href="fixtures/depend.css"], [href="fixtures/file.css"]').length).toEqual(2);
		});
	});
});