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
					responseText: ''
				});

				expect(document.title).toEqual('New Title');
			});
		});
	});

	describe('data-load-screen', function() {
		beforeAll(function() {
			var a = document.createElement('a');
			var div = document.createElement('div');

			a.href = 'content-screen.html';
			a.id = 'load_target';
			a.innerHTML = 'Load by screen';
			a.setAttribute('data-load-target', '#content_target');
			a.setAttribute('data-load-screen', 'xs sm md lg');

			div.id = 'content_target';

			document.body.appendChild(a);
			document.body.appendChild(div);
		});

		afterAll(function() {
			Moff.each(document.querySelectorAll('#content_target, #load_target'), function() {
				this.parentNode.removeChild(this);
			});
		});

		it('automatically loads by screen size', function() {
			jasmine.Ajax.withMock(function() {
				Moff.handleDataEvents();

				jasmine.Ajax.requests.mostRecent().respondWith({
					status: 200,
					contentType: 'text/plain',
					responseText: 'screen content'
				});

				expect(document.querySelector('#content_target').innerHTML).toEqual('screen content');
			});
		});
	});

	describe('data-load-module', function() {
		beforeAll(function() {
			Moff.amd.register({
				id: 'data-module'
			});

			var a = document.createElement('a');
			var div = document.createElement('div');

			a.href = 'content-screen.html';
			a.id = 'load_target';
			a.innerHTML = 'Load by screen';
			a.setAttribute('data-load-target', '#content_target');
			a.setAttribute('data-load-screen', 'xs sm md lg');
			a.setAttribute('data-load-module', 'data-module');

			div.id = 'content_target';

			document.body.appendChild(a);
			document.body.appendChild(div);
		});

		afterAll(function() {
			Moff.each(document.querySelectorAll('#content_target, #load_target'), function() {
				this.parentNode.removeChild(this);
			});
		});

		it('automatically loads register after content', function() {
			jasmine.Ajax.withMock(function() {
				Moff.handleDataEvents();

				jasmine.Ajax.requests.mostRecent().respondWith({
					status: 200,
					contentType: 'text/plain',
					responseText: ''
				});

				expect(Moff.amd._testonly._registeredFiles['data-module'].loaded).toBe(true);
			});
		});
	});
});