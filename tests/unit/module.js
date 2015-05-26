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