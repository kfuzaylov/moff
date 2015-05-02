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
		// Determine whether browser support touch JavaScript API
		// It does not mean touch device
		_detect.touch = !!(('ontouchstart' in _win) || _win.DocumentTouch && _doc instanceof _win.DocumentTouch);
		_detect.applicationCache = !!_win.applicationCache;
		_detect.canvas = (function() {
			var canvas = _doc.createElement('canvas');
			return !!(canvas.getContext && canvas.getContext('2d'));
		})();

		_detect.canvasText = !!(_detect.canvas && $.isFunction(_doc.createElement('canvas').getContext('2d').fillText));
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

		_detect.sessionSorage = (function() {
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
		var match = /(chrome)[ \/]([\w.]+)/.exec(_ua) ||
			/(webkit)[ \/]([\w.]+)/.exec(_ua) ||
			/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(_ua) ||
			/(msie) ([\w.]+)/.exec(_ua) ||
			_ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(_ua) || [];

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

		if (iOS) {
			OS.iOS = iOS;
		} else if (macOS) {
			OS.macOS = macOS;
		} else if (windows) {
			OS.windows = windows;
		} else if (android) {
			OS.android = android;
		}
	}

	this.init = function() {
		html5Support();
		detectBrowser();
		detectOS();
	};
}

export default Detect;
