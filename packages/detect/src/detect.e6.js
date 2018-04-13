/**
 * Detects OS, browser and another features support.
 * @module Detect
 */
function Detect() {
	/**
	 * @property {Window} _win - Link to Window object.
	 * @private
	 */
	var _win = window;

	/**
	 * @property {Detect} _detect - Link to this object.
	 * @private
	 */
	var _detect = this;

	/**
	 * @property {string} _ua - Link to user agent.
	 * @private
	 */
	var _ua = window.navigator.userAgent.toLowerCase();

	/**
	 * @property {HTMLDocument} _doc - Link to document object.
	 * @private
	 */
	var _doc = document;

	/**
	 * @property {{}} browser - Object with browser details.
	 */
	this.browser = {};

	/**
	 * @property {{}} OS - Object with OS details.
	 */
	this.OS = {};

	/**
	 * HTML5 support list.
	 * @function html5Support
	 */
	function html5Support() {
		// Determine whether browser support touch JavaScript API. It does not mean touch device
		_detect.touch = !!(('ontouchstart' in _win) || _win.DocumentTouch && _doc instanceof _win.DocumentTouch);
		_detect.applicationCache = !!_win.applicationCache;
		_detect.canvas = (function() {
			var canvas = _doc.createElement('canvas');

			return !!(canvas.getContext && canvas.getContext('2d'));
		})();

		_detect.canvasText = !!(_detect.canvas && typeof _doc.createElement('canvas').getContext('2d').fillText === 'function');
		_detect.dragAndDrop = (function() {
			var div = _doc.createElement('div');

			return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
		})();

		_detect.hashChange = !!('onhashchange' in _win && (typeof _doc.documentMode === 'undefined' || _doc.documentMode > 7));
		_detect.history = !!(_win.history && history.pushState);
		_detect.postMessage = !!_win.postMessage;
		_detect.webSockets = !!('WebSocket' in _win || 'MozWebSocket' in _win);
		_detect.webWorkers = !!_win.Worker;
		_detect.audio = (function() {
			var audio = _doc.createElement('audio');
			var bool = false;

			try {
				if (!!audio.canPlayType) {
					bool = {};
					bool.ogg = audio.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, '');
					bool.mp3 = audio.canPlayType('audio/mpeg;').replace(/^no$/, '');
					bool.wav = audio.canPlayType('audio/wav; codecs="1"').replace(/^no$/, '');
					bool.m4a = (audio.canPlayType('audio/x-m4a;') || audio.canPlayType('audio/aac;')).replace(/^no$/, '');
				}
			} catch (error) {}

			return bool;
		})();

		_detect.video = (function() {
			var video = _doc.createElement('video');
			var bool = false;

			try {
				if (!!video.canPlayType) {
					bool = {};
					bool.ogg = video.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, '');
					bool.h264 = video.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, '');
					bool.webm = video.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, '');
				}
			} catch (error) {}

			return bool;
		})();

		_detect.indexedDB = (function() {
			var props = ['indexedDB', 'webkitIndexedDB', 'mozIndexedDB', 'OIndexedDB', 'msIndexedDB'];

			for (var i in props) {
				if (props.hasOwnProperty(i)) {
					var item = _win[props[i]];

					if (item !== undefined) {
						if (item === false) {
							return props[i];
						}

						if (typeof item === 'function') {
							return item.bind(_win);
						}

						return item;
					}
				}
			}

			return false;
		})();

		_detect.localStorage = (function() {
			try {
				localStorage.setItem(_detect.mode, _detect.mode);
				localStorage.removeItem(_detect.mode);

				return true;
			} catch (error) {
				return false;
			}
		})();

		_detect.sessionStorage = (function() {
			try {
				sessionStorage.setItem(_detect.mode, _detect.mode);
				sessionStorage.removeItem(_detect.mode);

				return true;
			} catch (error) {
				return false;
			}
		})();
	}

	/**
	 * Detect browser
	 * @function detectBrowser
	 */
	function detectBrowser() {
		var match = /(edge)[\/]([0-9\.]+)/.exec(_ua) ||
			/(chrome)[ \/]([\w.]+)/.exec(_ua) ||
			/(webkit)[ \/]([\w.]+)/.exec(_ua) ||
			/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(_ua) ||
			/(msie) ([\w.]+)/.exec(_ua) ||
			/(trident).+ rv:([\d+.]+)/.exec(_ua) ||
			_ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(_ua) || [];

		if (match[1] === 'trident') {
			match[1] = 'msie';
		}

		if (match[1]) {
			_detect.browser[match[1]] = true;
		}

		if (match[2]) {
			_detect.browser.version = match[2];
		}

		if (_detect.browser.chrome) {
			_detect.browser.webkit = true;
		}
	}

	/**
	 * Detect Operating System
	 * @function detectOS
	 */
	function detectOS() {
		var OS = _detect.OS;
		var iOS = /(ipad|iphone|ipod)/g.test(_ua);
		var macOS = _ua.indexOf('mac') > -1;
		var windows = _ua.indexOf('win') > -1;
		var android = _ua.indexOf('android') > -1;
		var windowsPhone = _ua.indexOf('windows phone') > -1;

		if (iOS) {
			OS.iOS = iOS;
		} else if (macOS) {
			OS.macOS = macOS;
		} else if (windows) {
			OS.windows = windows;
		} else if (android) {
			OS.android = android;
		} else if (windowsPhone) {
			OS.windowsPhone = windowsPhone;
		}
	}

	/**
	 * Detects whether the current device is mobile
	 * @function detectMobileDevice
	 */
	function detectMobileDevice() {
		_detect.isMobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(_ua);
	}

	/**
	 * Check for CSS3 property support.
	 * @method supportCSS3
	 * @param {string} property - CSS3 property
	 * @returns {boolean}
	 */
	this.supportCSS3 = function(property) {
		var ucProp = property.charAt(0).toUpperCase() + property.slice(1);
		var props = (`${property} ${'Webkit Moz O ms'.split(' ').join(`${ucProp} `)}${ucProp}`).split(' ');
		var length = props.length;
		var i = 0;

		for (; i < length; i++) {
			property = props[i];

			if (property.indexOf('-') === -1 && document.createElement('div').style[property] !== undefined) {
				return true;
			}
		}

		return false;
	};

	html5Support();
	detectBrowser();
	detectOS();
	detectMobileDevice();
}

export default Detect;
