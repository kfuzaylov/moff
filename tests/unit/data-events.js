describe('Data events', function() {

	describe('data-load-target', function() {
		var beforeLoad, afterLoad;

		beforeAll(function() {
			Moff.settings('loadOnHover', true);
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

		it('can preload data on hover event', function() {
			jasmine.Ajax.withMock(function() {
				$('#content_target, #load_target').remove();
				$('body').append($('<a href="content-preload.html" data-load-target="#content_target" id="load_target">Load content click</a><div id="content_target"></div>'));
				Moff.reusableEvents();
				var target = $('#load_target').trigger('mouseenter');

				jasmine.Ajax.requests.mostRecent().respondWith({
					status: 200,
					contentType: 'text/plain',
					responseText: 'hello'
				});

				expect(Moff._testonly._cache[target.attr('href')]).toEqual('hello');
			});
		});

		it('should clear cache each n seconds', function(done) {
			setTimeout(function() {
				expect(Moff._testonly._cache['content-preload.html']).toBeUndefined();
				done();
			}, Moff.settings('cacheLiveTime'));
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