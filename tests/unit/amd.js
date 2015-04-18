describe('AMD', function() {
	var before, after;

	beforeAll(function() {
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
	});


	describe('Moff.register method', function() {
		it('registers new module', function() {
			expect(typeof Moff._testonly._registeredFiles().moduleId).toEqual('object');
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

		it('includes registered module', function() {
			expect(included).toEqual(true);
		});

		it('runs beforeInclude callback', function() {
			expect(before).toEqual(true);
		});

		it('runs afterInclude callback', function() {
			expect(after).toEqual(true);
		});
	});
});