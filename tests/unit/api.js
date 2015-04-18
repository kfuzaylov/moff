describe('Moff dependency', function() {
	it('is jQuery', function() {
		expect(typeof window.$.fn.jquery).toEqual('string');
	});
});

describe('Moff framework', function() {
	it('is initialized', function() {
		expect(typeof window.Moff).toBe('object');
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
		it('getter', function() {
			Moff.settings('cache', true);
			expect(Moff.settings('cache')).toBe(true);
		});

		it('setter', function() {
			Moff.settings('cacheLiveTime', 14);
			var cacheLiveTime = Moff.settings('cacheLiveTime');
			expect(cacheLiveTime).toBe(14);
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
				expect(div.css('opacity')).toBe('1');
				done();
			}, 1100);
		});

		it('show element in set time - 2 seconds', function(done) {
			Moff.appear(div2, 2);
			setTimeout(function() {
				expect(div2.css('opacity')).toBe('1');
				done();
			}, 2100);
		});
	});

	describe('Moff.isVisible method', function() {
		var div = $('<div>').appendTo('body');
		var div2 = $('<div style="position: relative; top: 1500px;"></div>').appendTo('body');

		it('determines element in view port', function() {
			expect(Moff.isVisible(div)).toBe(true);
		});

		it('determines element is not in view port', function() {
			expect(Moff.isVisible(div2)).toBe(false);
		});
	});

	describe('Moff.supportCSS3 method', function() {
		it('determines CSS3 property support', function() {
			expect([true, false]).toContain(Moff.supportCSS3('transition'));
		});

		it('doesn\'t throw exception for non-existing property', function() {
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
});