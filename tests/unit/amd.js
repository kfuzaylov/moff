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