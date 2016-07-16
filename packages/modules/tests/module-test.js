describe('Moff.modules API', function() {

	describe('Moff.modules.create', function() {
		beforeAll(function() {
			Moff.modules.create('Slideshow',
				{
					js: ['fixtures/depend.js'],
					css: ['fixtures/depend.css']
				},
				function() {}
			);
		});

		it('creates Moff.Module class in storage', function() {
			expect(Moff.modules._testonly._moduleClassStorage.Slideshow).not.toBeUndefined();
		});

		it('registers constructor and dependency files', function() {
			expect(typeof Moff.modules._testonly._moduleClassStorage.Slideshow.constructor).toEqual('function');
			expect(typeof Moff.modules._testonly._moduleClassStorage.Slideshow.depend).toEqual('object');
		});

		it('does not overwrite existing class', function() {
			Moff.modules.create('Slideshow', function() {});
			expect(typeof Moff.modules._testonly._moduleClassStorage.Slideshow.depend).toEqual('object');
		});
	});

	describe('Moff.modules.initClass', function() {
		var beforeInit, init, afterInit;

		beforeAll(function(done) {
			var div = document.createElement('div');

			div.innerHTML = '<div class="inside"></div>';
			div.className = 'mod-wrapper';

			var inside = document.createElement('div');

			inside.className = 'inside';

			document.body.appendChild(div);
			document.body.appendChild(inside);

			Moff.modules.create('Module2', function() {
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

			Moff.modules.initClass('Slideshow', {
				id: 43,
				config: {},
				afterInit() {
					done();
				}
			});
		});

		it('loads all dependency files', function() {
			expect(document.querySelectorAll('[src="fixtures/depend.js"], [href="fixtures/depend.css"]').length).toEqual(2);
			var s = document.querySelector('script[src="fixtures/depend.js"]');

			s.parentNode.removeChild(s);
		});

		it('beforeInit and init hooks access the properties', function() {
			Moff.modules.initClass('Module2', {id: 'modId'});
		});

		it('runs init hooks', function() {
			expect(beforeInit).toBe(true);
			expect(afterInit).toBe(true);
			expect(init).toBe(true);
		});

		it('registers module scope', function() {
			expect(Moff.modules.get('Module2').scope.className).toEqual('mod-wrapper');
		});

		it('register events', function() {
			expect(Array.isArray(Moff.event._testonly._eventStore.event1)).toBe(true);
			expect(Array.isArray(Moff.event._testonly._eventStore.event2)).toBe(true);
		});
	});

	describe('Moff.modules.get', function() {
		var moduleObject;

		beforeAll(function() {
			moduleObject = Moff.modules.get('Module2');
		});

		it('gets module class object by name', function() {
			expect(typeof moduleObject).toEqual('object');
			Moff.modules.initClass('Module2', {id: 'modId'});
			expect(Array.isArray(Moff.modules.get('Module2'))).toBe(true);
			expect(Moff.modules.get('Module2').length).toEqual(2);
		});
	});

	describe('Moff.modules.getAll', function() {
		it('gets all class instances by name', function() {
			expect(Object.keys(Moff.modules.getAll()).length).toEqual(2);
		});
	});

	describe('Moff.modules.getBy', function() {
		it('gets filtered class instances by passed property', function() {
			expect(Moff.modules.getBy('id', 'modId').length).toEqual(2);
			expect(Moff.modules.getBy('class', 'Module2').length).toEqual(2);
		});
	});

	describe('Moff.modules.remove', function() {
		it('removes all objects by class name', function() {
			Moff.modules.remove('Module2');
			expect(Moff.modules.get('Module2')).toBeUndefined();

			Moff.modules.initClass('Module2', {id: 'modId2'});
			expect(typeof Moff.modules.get('Module2')).toEqual('object');
			Moff.modules.remove('Module2');
			expect(Moff.modules._testonly._moduleObjectStorage.Module2).toBeUndefined();

			Moff.modules.initClass('Module2', {id: 'modId2'});
			var module2 = Moff.modules.get('Module2');

			Moff.modules.remove(module2);
			expect(Moff.modules._testonly._moduleObjectStorage.Module2).toBeUndefined();
		});
	});
});

describe('Moff.Module Base Class', function() {
	beforeAll(function() {
		Moff.modules.create('TesModule', function() {});
		Moff.modules.initClass('TesModule');
		Moff.modules.initClass('Module2');
	});

	describe('Initialized module class', function() {
		var moduleObject, testObject;

		beforeAll(function() {
			moduleObject = Moff.modules.get('Module2');
			testObject = Moff.modules.get('TesModule');
		});

		it('has find method to search inside module scope', function() {
			expect(typeof testObject.find).toEqual('function');
			expect(moduleObject.find('.inside').length).toEqual(1);
		});

		it('has scopeSelector property', function() {
			expect(testObject.scopeSelector).not.toBeUndefined();
		});

		it('has scope property', function() {
			expect(testObject.scope).not.toBeUndefined();
			expect(typeof moduleObject.scope).toEqual('object');
		});

		it('set only defined scope', function() {
			moduleObject.scopeSelector = null;
			moduleObject.setScope();
			expect(moduleObject.scope.className).toEqual('mod-wrapper');
		});

		it('has events property', function() {
			expect(Array.isArray(testObject.events)).toBe(true);
		});

		it('has beforeInit, afterInit and init hooks', function() {
			expect(typeof testObject.beforeInit).toEqual('function');
			expect(typeof testObject.afterInit).toEqual('function');
			expect(typeof testObject.init).toEqual('function');
		});
	});

	describe('Moff.Module.reopen method', function() {
		var test;

		beforeAll(function() {
			Moff.Module.reopen({
				newProp: 1,
				newMethod() {
					return 1;
				}
			});

			Moff.modules.create('Test', function() {});
			Moff.modules.initClass('Test');
			test = Moff.modules.get('Test');
		});

		it('adds new methods and properties', function() {
			expect(test.newProp).toEqual(1);
			expect(typeof test.newMethod).toEqual('function');
			expect(test.newMethod()).toEqual(1);
		});

		it('overwrites methods and properties', function() {
			Moff.Module.reopen({
				newProp: 3,
				newMethod: function() {
					return 2;
				}
			});

			Moff.modules.create('Test2', function() {});
			Moff.modules.initClass('Test2');
			var test = Moff.modules.get('Test2');

			expect(test.newProp).toEqual(3);
			expect(typeof test.newMethod).toEqual('function');
			expect(test.newMethod()).toEqual(2);
		});
	});
});
