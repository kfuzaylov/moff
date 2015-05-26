describe('AMD', function() {

	describe('Moff.register method', function() {
		beforeAll(function() {
			Moff.register({
				id: 'fakeId'
			});
		});

		it('registers new module', function() {
			expect(typeof Moff._testonly._registeredFiles().fakeId).toEqual('object');
		});

		it('normalizes registered object', function() {
			expect(Moff._testonly._registeredFiles().fakeId.loaded).toBe(false);

			expect(typeof Moff._testonly._registeredFiles().fakeId.depend).toEqual('object');
			expect(Array.isArray(Moff._testonly._registeredFiles().fakeId.depend.js)).toBe(true);
			expect(Array.isArray(Moff._testonly._registeredFiles().fakeId.depend.css)).toBe(true);

			expect(typeof Moff._testonly._registeredFiles().fakeId.files).toEqual('object');
			expect(Array.isArray(Moff._testonly._registeredFiles().fakeId.files.js)).toBe(true);
			expect(Array.isArray(Moff._testonly._registeredFiles().fakeId.files.css)).toBe(true);

			expect(Array.isArray(Moff._testonly._registeredFiles().fakeId.loadOnScreen)).toBe(true);
			expect(Moff._testonly._registeredFiles().fakeId.beforeInclude).toBeUndefined();
			expect(Moff._testonly._registeredFiles().fakeId.afterInclude).toBeUndefined();
			expect(Moff._testonly._registeredFiles().fakeId.onWindowLoad).toBe(false);
		});
	});

	describe('Moff.include method', function() {
		var included, before, after;

		beforeAll(function(done) {
			Moff.register({
				id: 'moduleId',
				depend: {
					js: ['fixtures/depend.js'],
					css: ['fixtures/depend.css']
				},
				files: {
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

			Moff.include('moduleId', function() {
				included = true;
				done();
			});
		});

		afterAll(function() {
			var nodes = document.querySelectorAll('[src="fixtures/depend.js"], [src="fixtures/file.js"], [href="fixtures/depend.css"], [href="fixtures/file.css"]');
			Moff.each(nodes, function(i, element) {
				this.parentNode.removeChild(this);
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
	});
});
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
describe('Data events', function() {

	describe('data-load-target', function() {
		var beforeLoad, afterLoad;

		beforeAll(function() {
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

			Moff.beforeLoad(function() {
				beforeLoad = true;
			});

			Moff.afterLoad(function() {
				afterLoad = true;
			});
		});

		afterAll(function() {
			Moff.each(document.querySelectorAll('#content_target, #load_target'), function() {
				this.parentNode.removeChild(this);
			});
		});

		beforeEach(function() {
			// jasmine.Ajax.install();
		});

		afterEach(function() {
			jasmine.Ajax.uninstall();
		});

		it('specifies target content to be loaded in', function() {
			jasmine.Ajax.withMock(function() {
				var event = document.createEvent('Event');
				event.initEvent('click', true, true);

				document.querySelector('#load_target').dispatchEvent(event);

				jasmine.Ajax.requests.mostRecent().respondWith({
					"status": 200,
					"contentType": 'text/plain',
					"responseText": 'hello'
				});

				expect(document.querySelector('#content_target').innerHTML).toEqual('hello');
			});
		});

		it('has beforeLoad callback', function() {
			expect(beforeLoad).toBe(true);
		});

		it('has afterLoad callback', function() {
			expect(afterLoad).toBe(true);
		});

		it('can preload data on hover event', function() {
			Moff.each(document.querySelectorAll('#content_target, #load_target'), function() {
				this.parentNode.removeChild(this);
			});

			jasmine.Ajax.withMock(function() {

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

		it('should clear cache each n seconds', function(done) {
			setTimeout(function() {
				expect(Object.keys(Moff._testonly._cache).length).toEqual(0);
				done();
			}, Moff.settings('cacheLiveTime'));
		});
	});

	describe('data-load-url', function() {
		beforeAll(function() {
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

		afterAll(function() {
			Moff.each(document.querySelectorAll('#content_target, #load_target'), function() {
				this.parentNode.removeChild(this);
			});
		});

		it('sets load url for an element', function() {
			jasmine.Ajax.withMock(function() {
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

	describe('data-page-title', function() {
		beforeAll(function() {
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

		afterAll(function() {
			Moff.each(document.querySelectorAll('#content_target, #load_target'), function() {
				this.parentNode.removeChild(this);
			});
		});

		it('changes document title', function() {
			jasmine.Ajax.withMock(function() {
				var event = document.createEvent('Event');
				event.initEvent('click', true, true);
				document.querySelector('#load_target').dispatchEvent(event);

				jasmine.Ajax.requests.mostRecent().respondWith({
					status: 200,
					contentType: 'text/plain',
					responseText: 'screen content'
				});

				expect(document.title).toEqual('New Title');
			});
		});
	});
});
describe('Moff Detect', function() {
	describe('HTML5 supports', function() {
		it('applicationCache feature', function() {
			expect(Moff.detect.applicationCache).not.toBeUndefined();
		});

		it('audio feature', function() {
			expect(typeof Moff.detect.audio).toEqual('object');
			expect(Moff.detect.audio.ogg).not.toBeUndefined();
			expect(Moff.detect.audio.mp3).not.toBeUndefined();
			expect(Moff.detect.audio.wav).not.toBeUndefined();
			expect(Moff.detect.audio.m4a).not.toBeUndefined();
		});

		it('video feature', function() {
			expect(typeof Moff.detect.video).toEqual('object');
			expect(Moff.detect.video.ogg).not.toBeUndefined();
			expect(Moff.detect.video.h264).not.toBeUndefined();
			expect(Moff.detect.video.webm).not.toBeUndefined();
		});

		it('touch feature', function() {
			expect(Moff.detect.touch).not.toBeUndefined();
		});

		it('canvas feature', function() {
			expect(Moff.detect.canvas).not.toBeUndefined();
		});

		it('canvasText feature', function() {
			expect(Moff.detect.canvasText).not.toBeUndefined();
		});

		it('canvasText dragAndDrop', function() {
			expect(Moff.detect.dragAndDrop).not.toBeUndefined();
		});

		it('hashChange dragAndDrop', function() {
			expect(Moff.detect.hashChange).not.toBeUndefined();
		});

		it('history postMessage', function() {
			expect(Moff.detect.postMessage).not.toBeUndefined();
		});

		it('history webSockets', function() {
			expect(Moff.detect.webSockets).not.toBeUndefined();
		});

		it('history webWorkers', function() {
			expect(Moff.detect.webWorkers).not.toBeUndefined();
		});

		it('indexedDB webWorkers', function() {
			expect(Moff.detect.indexedDB).not.toBeUndefined();
		});

		it('localStorage webWorkers', function() {
			expect(Moff.detect.localStorage).not.toBeUndefined();
		});

		it('localStorage sessionStorage', function() {
			expect(Moff.detect.sessionStorage).not.toBeUndefined();
		});
	});

	describe('Moff.browser', function() {
		it('supports browser detection', function() {
			expect(Moff.detect.browser.version).not.toBeUndefined();
			delete Moff.detect.browser.version;
			expect(['chrome', 'msie', 'mozilla', 'opera', 'webkit']).toContain(Object.keys(Moff.detect.browser)[0]);
		});
	})

	describe('Moff.OS', function() {
		it('supports OS detection', function() {
			expect(['iOS', 'macOS', 'windows', 'android', 'windowsPhone']).toContain(Object.keys(Moff.detect.OS)[0]);
		});
	});

	describe('Moff.detect.isMobile', function() {
		it('support mobile device detection', function() {
			expect(Moff.detect.isMobile).not.toBeUndefined();
		});
	});
});
describe('Event system', function() {
	var trigger;

	it('can register new event', function() {
		Moff.event.add('newEvent');
		expect(Array.isArray(Moff.event._testonly._eventStore['newEvent'])).toBe(true);
	});

	it('can assign for event only callbacks', function() {
		Moff.event.on('newEvent', function() {
			expect(arguments.length).toEqual(2);
			trigger = true;
		});

		expect(typeof Moff.event._testonly._eventStore['newEvent'][0]).toEqual('function');
		Moff.event.on('newEvent', {});
		expect(Moff.event._testonly._eventStore['newEvent'].length).toEqual(1);
	});

	it('can trigger callbacks and pass all arguments', function() {
		Moff.event.trigger('newEvent', 'text1', 'text2');
		expect(trigger).toBe(true);
	});
});
describe('Modularity', function() {

	describe('Moff module registration', function() {
		beforeAll(function() {
			Moff.module.register('Slideshow',
				{
					js: ['fixtures/depend.js'],
					css: ['fixtures/depend.css']
				},
				function() {}
			);
		});

		it('registers class in storage', function() {
			expect(Moff.module._testonly._moduleClassStorage.Slideshow).not.toBeUndefined();
		});

		it('registers constructor and dependency files', function() {
			expect(typeof Moff.module._testonly._moduleClassStorage.Slideshow.constructor).toEqual('function');
			expect(typeof Moff.module._testonly._moduleClassStorage.Slideshow.depends).toEqual('object');
		});

		it('does not overwrite existing class', function() {
			Moff.module.register('Slideshow', function() {});
			expect(typeof Moff.module._testonly._moduleClassStorage.Slideshow.depends).toEqual('object');
		});
	});

	describe('Moff initClass method', function() {
		var beforeInit, init, afterInit;

		beforeAll(function(done) {
			var div = document.createElement('div');
			div.innerHTML = '<div class="inside"></div>';
			div.className = 'mod-wrapper';

			var inside = document.createElement('div');
			inside.className = 'inside';

			document.body.appendChild(div);
			document.body.appendChild(inside);

			Moff.module.register('Module2', function() {
				this.scopeSelector = '.mod-wrapper';

				this.events = ['event1', 'event2'];

				this.beforeInit = function() {
					beforeInit = true;
					expect(this.id).toBeUndefined();
					expect(this.moduleName).toBeUndefined();
					expect(this.scope).toBeNull();
				};

				this.init = function() {
					init = true;
				};

				this.afterInit = function() {
					afterInit = true;
				};
			});

			Moff.module.initClass('Slideshow', {
				id: 43,
				config: {},
				afterInit: function() {
					done();
				}
			});
		});

		it('loads all dependency files', function() {
			expect(document.querySelectorAll('[src="fixtures/depend.js"], [href="fixtures/depend.css"]').length).toEqual(2);
			var s = document.querySelector('script[src="fixtures/depend.js"]');
			s.parentNode.removeChild(s);
		});

		it('beforeInit and init hooks access to properties', function() {
			Moff.module.initClass('Module2', {id: 'modId'});
		});

		it('runs init hooks', function() {
			expect(beforeInit).toBe(true);
			expect(afterInit).toBe(true);
			expect(init).toBe(true);
		});

		it('registers module scope', function() {
			expect(Moff.module.get('Module2').scope.className).toEqual('mod-wrapper');
		});

		it('register events', function() {
			expect(Array.isArray(Moff.module.event._testonly._eventStore['event1'])).toBe(true);
			expect(Array.isArray(Moff.module.event._testonly._eventStore['event2'])).toBe(true);
		});
	});

	describe('Initialized module class', function() {
		var moduleObject;
		beforeAll(function() {
			moduleObject = Moff.module.get('Module2');
		});

		it('has .find method to search inside module scope', function() {
			expect(moduleObject.find('.inside').length).toEqual(1);
		});

		it('set only defined scope', function() {
			moduleObject.scopeSelector = null;
			moduleObject.setScope();
			expect(moduleObject.scope.className).toEqual('mod-wrapper');
		});

		it('has get method', function() {
			expect(typeof moduleObject).toEqual('object');
			Moff.module.initClass('Module2', {id: 'modId'});
			expect(Array.isArray(Moff.module.get('Module2'))).toBe(true);
			expect(Moff.module.get('Module2').length).toEqual(2);
		});

		it('has getAll method', function() {
			expect(Object.keys(Moff.module.getAll()).length).toEqual(2);
		});

		it('has remove method', function() {
			moduleObject.remove();
			expect(Moff.module.get('Module2')).toBeUndefined();

			Moff.module.initClass('Module2', {id: 'modId'});
			Moff.module.initClass('Module2', {id: 'modId2'});
			Moff.module.get('Module2')[0].remove();

			expect(typeof Moff.module.get('Module2')).toEqual('object');
			Moff.module.get('Module2').remove();
			expect(Moff.module._testonly._moduleObjectStorage['Module2']).toBeUndefined();

			Moff.module.initClass('Module2');
			Moff.module.get('Module2').remove();
			expect(Moff.module._testonly._moduleObjectStorage['Module2']).toBeUndefined();

		});
	});
});