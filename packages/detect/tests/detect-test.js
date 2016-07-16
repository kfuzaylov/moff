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

	describe('Moff.detect.browser', function() {
		it('supports browser detection', function() {
			expect(Moff.detect.browser.version).not.toBeUndefined();
			delete Moff.detect.browser.version;
			expect(['chrome', 'msie', 'mozilla', 'opera', 'webkit', 'edge']).toContain(Object.keys(Moff.detect.browser)[0]);
		});
	});

	describe('Moff.detect.OS', function() {
		it('supports OS detection', function() {
			expect(['iOS', 'macOS', 'windows', 'android', 'windowsPhone']).toContain(Object.keys(Moff.detect.OS)[0]);
		});
	});

	describe('Moff.detect.isMobile', function() {
		it('support mobile device detection', function() {
			expect(Moff.detect.isMobile).not.toBeUndefined();
		});
	});

	describe('Moff.detect.supportCSS3 method', function() {
		it('determines CSS3 property support', function() {
			expect([true, false]).toContain(Moff.detect.supportCSS3('transition'));
		});

		it('does not throw exception for non-existing property', function() {
			expect(Moff.detect.supportCSS3('no-property')).toBe(false);
		});

		it('support CSS2 properties too', function() {
			expect(Moff.detect.supportCSS3('width')).toBe(true);
		});
	});
});
