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
			expect($.isArray(Moff._testonly._registeredFiles().fakeId.depend.js)).toBe(true);
			expect($.isArray(Moff._testonly._registeredFiles().fakeId.depend.css)).toBe(true);

			expect(typeof Moff._testonly._registeredFiles().fakeId.files).toEqual('object');
			expect($.isArray(Moff._testonly._registeredFiles().fakeId.files.js)).toBe(true);
			expect($.isArray(Moff._testonly._registeredFiles().fakeId.files.css)).toBe(true);

			expect($.isArray(Moff._testonly._registeredFiles().fakeId.loadOnScreen)).toBe(true);
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
			$('[src="fixtures/depend.js"], [src="fixtures/file.js"], [href="fixtures/depend.css"], [href="fixtures/file.css"]').remove();
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
describe('Moff dependency', function() {
	it('is jQuery', function() {
		expect(typeof window.$.fn.jquery).toEqual('string');
	});
});

describe('Moff framework', function() {
	it('is initialized', function() {
		expect(typeof window.Moff).toEqual('object');
	});
});

describe('Moff framework API', function() {
	describe('Moff.getMode', function() {
		it('get current screen mode', function() {
			var mode = Moff.getMode();
			expect(['xs', 'sm', 'md', 'lg']).toContain(mode);
		});
	});

	describe('Moff.settings', function() {
		it('has getter', function() {
			Moff.settings('cache', true);
			expect(Moff.settings('cache')).toBe(true);
		});

		it('has setter', function() {
			Moff.settings('cacheLiveTime', 14);
			var cacheLiveTime = Moff.settings('cacheLiveTime');
			expect(cacheLiveTime).toEqual(14);
		});

		it('setter should return undefined for unregistered key', function() {
			expect(Moff.settings('unregisteredKey')).toBeUndefined();
		});
	});

	describe('Moff.appear method', function() {
		var div = $('<div style="opacity: 0;"></div>');
		var div2 = $('<div style="opacity: 0;"></div>');

		afterAll(function() {
			div.remove();
			div2.remove();
		});

		it('show element by default in 1 second', function(done) {
			Moff.appear(div);
			setTimeout(function() {
				expect(div.css('opacity')).toEqual('1');
				done();
			}, 1100);
		});

		it('show element in set time - 2 seconds', function(done) {
			Moff.appear(div2, 2);
			setTimeout(function() {
				expect(div2.css('opacity')).toEqual('1');
				done();
			}, 2100);
		});
	});

	describe('Moff.isVisible method', function() {
		var div = $('<div>').appendTo('body');
		var div2 = $('<div style="position: relative; top: -2500px;"></div>').appendTo('body');

		afterAll(function() {
			div.remove();
			div2.remove();
		});

		it('determines element in view port', function() {
			expect(Moff.inViewport(div)).toBe(true);
		});

		it('determines element is not in view port', function() {
			expect(Moff.inViewport(div2)).toBe(false);
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

	describe('Moff.loadJS method', function() {
		it('loads array of js files', function(done) {
			Moff.loadJS(['fixtures/depend.js', 'fixtures/file.js'], function() {
				expect($('script[src="fixtures/depend.js"], script[src="fixtures/file.js"]').length).toEqual(2);
				$('script[src="fixtures/depend.js"], script[src="fixtures/file.js"]').remove();
				done();
			});
		});

		it('loads single files', function(done) {
			Moff.loadJS('fixtures/depend.js', function() {
				expect($('script[src="fixtures/depend.js"]').length).toEqual(1);
				done();
			});
		});

		it('does not load existing file', function(done) {
			Moff.loadJS('fixtures/depend.js');
			setTimeout(function() {
				expect($('script[src="fixtures/depend.js"]').length).toEqual(1);
				done();
			}, 1000);
		});
	});
});
describe('Data events', function() {

	describe('data-load-target', function() {
		var beforeLoad, afterLoad;

		beforeAll(function() {
			$('body').append($('<a href="content.html" data-load-target="#content_target" id="load_target">Load content click</a><div id="content_target"></div>'));
			Moff.reusableEvents();

			Moff.beforeLoad(function() {
				beforeLoad = true;
			});

			Moff.afterLoad(function() {
				afterLoad = true;
			});
		});

		afterAll(function() {
			$('#content_target, #load_target').remove();
		});

		beforeEach(function() {
			jasmine.Ajax.install();
		});

		afterEach(function() {
			jasmine.Ajax.uninstall();
		});

		it('specifies target content to be loaded in', function() {
			jasmine.Ajax.withMock(function() {
				$('#load_target').trigger('click');

				jasmine.Ajax.requests.mostRecent().respondWith({
					status: 200,
					contentType: 'text/plain',
					responseText: 'hello'
				});

				expect($('#content_target').html()).toEqual('hello');
			});
		});

		it('has beforeLoad callback', function() {
			expect(beforeLoad).toBe(true);
		});

		it('has afterLoad callback', function() {
			expect(afterLoad).toBe(true);
		});
	});

	describe('data-load-url', function() {
		beforeAll(function() {
			$('body').append($('<span data-load-url="content2.html" data-load-target="#content_target" id="load_target">Load content url</span><div id="content_target"></div>'));
			Moff.reusableEvents();
		});

		afterAll(function() {
			$('#content_target, #load_target').remove();
		});

		it('sets load event type for an element', function() {
			jasmine.Ajax.withMock(function() {
				$('#load_target').trigger('click');

				jasmine.Ajax.requests.mostRecent().respondWith({
					status: 200,
					contentType: 'text/plain',
					responseText: 'dom loaded'
				});

				expect($('#content_target').html()).toEqual('dom loaded');
			});
		});
	});

	describe('data-page-title', function() {
		beforeAll(function() {
			$('body').append($('<a href="content.html" data-load-target="#content_target" data-page-title="New Title" id="load_target">Page title</a><div id="content_target"></div>'));
			Moff.reusableEvents();
		});

		afterAll(function() {
			$('#content_target, #load_target').remove();
		});

		it('determines what screen size content can be loaded', function() {
			jasmine.Ajax.withMock(function() {
				$('#load_target').trigger('click');

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
describe('Event system', function() {
	var trigger;

	it('can register new event', function() {
		Moff.event.add('newEvent');
		expect($.isArray(Moff.event._testonly._eventStore['newEvent'])).toBe(true);
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

	it('supports browser detection', function() {
		expect(Moff.detect.browser.version).not.toBeUndefined();
		delete Moff.detect.browser.version;
		expect(['chrome', 'msie', 'mozilla', 'opera', 'webkit']).toContain(Object.keys(Moff.detect.browser)[0]);
	});

	it('supports OS detection', function() {
		expect(['iOS', 'macOS', 'windows', 'android', 'windowsPhone']).toContain(Object.keys(Moff.detect.OS)[0]);
	});

	it('support mobile device detection', function() {
		expect(Moff.detect.isMobile).not.toBeUndefined();
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
			$('body').append('<div class="mod-wrapper"><div class="inside"></div></div><div class="inside"></div>');

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
			expect($('[src="fixtures/depend.js"], [href="fixtures/depend.css"]').length).toEqual(2);
			$('script[src="fixtures/depend.js"]').remove();
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
			expect(Moff.module.get('Module2').scope.length).toEqual(1);
		});

		it('register events', function() {
			expect($.isArray(Moff.module.event._testonly._eventStore['event1'])).toBe(true);
			expect($.isArray(Moff.module.event._testonly._eventStore['event2'])).toBe(true);
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
			expect(moduleObject.scope.hasClass('mod-wrapper')).toBe(true);
		});

		it('has get method', function() {
			expect(typeof moduleObject).toEqual('object');
			Moff.module.initClass('Module2', {id: 'modId'});
			expect($.isArray(Moff.module.get('Module2'))).toBe(true);
			expect(Moff.module.get('Module2').length).toEqual(2);
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