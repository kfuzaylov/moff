/**
 * @overview  moff - Mobile First Framework
 * @author    Kadir A. Fuzaylov <kfuzaylov@dealersocket.com>
 * @version   1.12.2
 * @license   Licensed under MIT license
 * @copyright Copyright (c) 2015-2016 Kadir A. Fuzaylov
 */
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", {
	value: true
});
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
/**
 * Moff AMD component
 * @constructor
 */
function AMD() {
	/**
  * @property {AMD} _amd - Link to AMD object.
  * @private
  */
	var _amd = this;
	/**
  * @property {window} _win - Link to window object.
  * @private
  */
	var _win = window;
	/**
  * @property {HTMLDocument} _doc - Local link to document object.
  * @private
  */
	var _doc = _win.document;
	/**
  * @property {{}} _registeredFiles - Object to register files to be loaded.
  * @private
  */
	var _registeredFiles = {};
	/**
  * @property {Array} _deferredObjects - Deferred files.
  * @private
  */
	var _deferredObjects = [];
	/**
  * @property {boolean} _windowIsLoaded - Flag to determine whether the window is loaded.
  * @private
  */
	var _windowIsLoaded = false;
	/**
  * Window load event handler.
  * @function windowLoadHandler
  */
	function windowLoadHandler() {
		_windowIsLoaded = true;
		// Load deferred files.
		// These files included with Moff.amd.include method before window load event.
		Moff.each(_deferredObjects, function (i, obj) {
			_amd.include(obj.id, obj.callback);
		});
	}
	/**
  * Handle elements event.
  * @function handleEvents
  */
	function handleEvents() {
		_win.addEventListener('load', windowLoadHandler, false);
	}
	/**
  * Check url hash tag to load registered files.
  * @function includeRegister
  */
	function includeRegister() {
		Moff.each(_registeredFiles, function (id, object) {
			// Don't load register if it is used in data-load-module attribute because it will be included after content of element be loaded.
			if (object.loadOnScreen.length && object.loadOnScreen.indexOf(Moff.getMode()) !== -1 && !_doc.querySelectorAll('[data-load-module="' + id + '"]').length) {
				_amd.include(id);
			}
		});
	}
	/**
  * Register files to be loaded files.
  * @method register
  * @param {object} obj - Registered object
  */
	this.register = function (obj) {
		// Normalize obj properties
		_registeredFiles[obj.id] = {
			loaded: false,
			depend: {
				js: obj.depend && obj.depend.js || [],
				css: obj.depend && obj.depend.css || []
			},
			file: {
				js: obj.file && obj.file.js || [],
				css: obj.file && obj.file.css || []
			},
			loadOnScreen: obj.loadOnScreen || [],
			beforeInclude: obj.beforeInclude || undefined,
			afterInclude: obj.afterInclude || undefined,
			onWindowLoad: obj.onWindowLoad || false
		};
	};
	/**
  * Load registered files by identifier.
  * @method include
  * @param {string} id - Included object id
  * @param {function} [callback] - Function callback
  * @param {object} [options] - Include options
  */
	this.include = function (id, callback) {
		var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
		var register = _registeredFiles[id];
		if (!register) {
			return;
		}
		// Normalize arguments
		if ((typeof callback === 'undefined' ? 'undefined' : _typeof(callback)) === 'object') {
			options = callback;
			callback = undefined;
		}
		var hasCallback = typeof callback === 'function';
		// Make sure files are not loaded
		if (!options.reload && register.loaded) {
			if (hasCallback) {
				callback();
			}
			return;
		}
		// Make sure to load after window load if onWindowLoad is true
		if (register.onWindowLoad && !_windowIsLoaded) {
			// Save id to load after window load
			_deferredObjects.push({ id: id, callback: callback });
			return;
		}
		// Mark as loaded
		register.loaded = true;
		if (typeof register.beforeInclude === 'function') {
			register.beforeInclude();
		}
		function loadFiles() {
			Moff.loadAssets(register.file, execCallback, options);
		}
		Moff.loadAssets(register.depend, loadFiles, options);
		function execCallback() {
			if (typeof register.afterInclude === 'function') {
				register.afterInclude();
			}
			if (hasCallback) {
				callback();
			}
		}
	};
	Moff.$(function () {
		handleEvents();
		includeRegister();
	});
}
exports.default = AMD;
},{}],2:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", {
	value: true
});
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
/**
 * Moff class
 * @constructor
 */
function Core() {
	/**
  * @property {window} _win - Link to window object.
  * @private
  */
	var _win = window;
	/**
  * @property {Core} _moff - Link to Core object
  * @private
  */
	var _moff = this;
	/**
  * @property {HTMLDocument} _doc - Local link to document object.
  * @private
  */
	var _doc = _win.document;
	/**
  * @property {null} _loader - CSS preloader object
  * @private
  */
	var _loader2 = null;
	/**
  * @property {null} _loaderBox - CSS preloader object
  * @private
  */
	var _loaderBox = null;
	/**
  * @property {boolean} _matchMediaSupport - Match media support and link.
  * @private
  */
	var _matchMediaSupport = !!(_win.matchMedia && _win.matchMedia('screen').addListener);
	/**
  * @property {boolean|Window.matchMedia|*} _matchMedia - Short link to matchMedia.
  * @private
  */
	var _matchMedia = _matchMediaSupport && _win.matchMedia;
	/**
  * @property {string} _mqSmall - Media query breakpoint conditions.
  * @private
  */
	var _mqSmall = '(min-width: %dpx)';
	/**
  * @type {string} _mqMedium - Link to _mqSmall
  * @private
  */
	var _mqMedium = _mqSmall;
	/**
  * @type {string} _mqLarge - Link to _mqSmall
  * @private
  */
	var _mqLarge = _mqSmall;
	/**
  * @property {string} _lastViewMode - List name of device screen mode
  * @private
  */
	var _lastViewMode;
	/**
  * @property {Array} _changeViewCallbacks - Array of callbacks to trigger on view change.
  * @private
  */
	var _changeViewCallbacks = [];
	/**
  * @property {Array} _domLoadedCallbacks - Array of callbacks to trigger on DOMContentLoaded event.
  * @private
  */
	var _domLoadedCallbacks = [];
	/**
  * @property {boolean} _domIsLoaded - Flag to determine whether the DOM is loaded.
  * @private
  */
	var _domIsLoaded = false;
	/**
  * @property {Array} _beforeLoad - Run these callbacks before content loading.
  * @private
  */
	var _beforeLoad = [];
	/**
  * @property {Array} _afterLoad - Run these callbacks after content is loaded.
  * @private
  */
	var _afterLoad = [];
	/**
  * @property {{}} _cache - Preloaded data cache
  * @private
  */
	var _cache = {};
	/**
  * @property {[]} _loadOnViewport - Array of elements to be loaded on viewport
  * @private
  */
	var _loadOnViewport = [];
	/**
  * @property {object} _settings - Local default settings.
  * @private
  */
	var _settings = {
		breakpoints: {
			sm: 768,
			md: 992,
			lg: 1200
		},
		loadOnHover: true,
		cacheLiveTime: 2000
	};
	/**
  * @property {string[]} _dataAttrs - Array of data event attributes
  * @private
  */
	var _dataAttrs = ['[data-load-target]', '[data-load-module]', '[data-load-event]', '[data-load-url]', '[data-load-screen]', '[data-push-url]', '[data-page-title]'];
	/**
  * @property {{}} _historyData - History data store.
  * @private
  */
	var _historyData = {};
	/**
  * Handle elements event.
  * @function handleEvents
  */
	function handleEvents() {
		// Check for addListener method
		// because respond.js emulates matchMedia method
		if (_matchMediaSupport) {
			_matchMedia(_mqLarge).addListener(resizeHandler);
			_matchMedia(_mqMedium).addListener(resizeHandler);
			_matchMedia(_mqSmall).addListener(resizeHandler);
		} else {
			// If matchMedia is not supported use resize fallback
			_win.addEventListener('resize', resizeHandler, false);
		}
		_win.addEventListener('scroll', scrollHandler, false);
		_win.addEventListener('popstate', handlePopstate, false);
		_moff.handleDataEvents();
	}
	function addPreloaderStyles() {
		var style = document.createElement('style');
		style.appendChild(document.createTextNode('\n\t\t\t.moff-loader {\n\t\t\t\tdisplay: none;\n\t\t\t\tposition: absolute;\n\t\t\t\twidth: 50px;\n\t\t\t\theight: 50px;\n\t\t\t\tleft: 0;\n\t\t\t\ttop: 0;\n\t\t\t\tz-index: 9999;\n\t\t\t\t-webkit-transition: 0s ease-in;\n\t\t\t\t-moz-transition: 0s ease-in;\n\t\t\t\t-o-transition: 0s ease-in;\n\t\t\t\ttransition: 0s ease-in;\n\t\t\t}\n\t\t\t.moff-loader.__default {\n\t\t\t\ttop: 12px;\n\t\t\t\tleft: 50%;\n\t\t\t\tmargin-left: -25px;\n\t\t\t\tposition: fixed;\n\t\t\t}\n\t\t\t.moff-loader.__ie9-preloader {\n\t\t\t\tbackground: url(\'http://moffjs.com/images/ie9-preloader.gif\');\n\t\t\t}\n\t\t\t.moff-loader.__ie9-preloader .moff-loader_box {\n\t\t\t\tdisplay: none;\n\n\t\t\t}\n\t\t\t.moff-loader.__visible {\n\t\t\t\tdisplay: block;\n\t\t\t}\n\t\t\t.moff-loader_box {\n\t\t\t\tposition: absolute;\n\t\t\t\twidth: 100%;\n\t\t\t\theight: 100%;\n\t\t\t\tborder-radius: 50%;\n\t\t\t\tborder: 1px solid transparent;\n\t\t\t\tborder-top-color: #3498db;\n\t\t\t\t-webkit-animation: spin 2s linear infinite;\n\t\t\t\tanimation: spin 2s linear infinite;\n\t\t\t}\n\t\t\t.moff-loader_box:before {\n\t\t\t\tcontent: "";\n\t\t\t\tposition: absolute;\n\t\t\t\ttop: 2px;\n\t\t\t\tleft: 2px;\n\t\t\t\tright: 2px;\n\t\t\t\tbottom: 2px;\n\t\t\t\tborder-radius: 50%;\n\t\t\t\tborder: 1px solid transparent;\n\t\t\t\tborder-top-color: #e74c3c;\n\t\t\t\t-webkit-animation: spin 3s linear infinite;\n\t\t\t\tanimation: spin 3s linear infinite;\n\t\t\t}\n\t\t\t.moff-loader_box:after {\n\t\t\t\tcontent: "";\n\t\t\t\tposition: absolute;\n\t\t\t\ttop: 5px;\n\t\t\t\tleft: 5px;\n\t\t\t\tright: 5px;\n\t\t\t\tbottom: 5px;\n\t\t\t\tborder-radius: 50%;\n\t\t\t\tborder: 1px solid transparent;\n\t\t\t\tborder-top-color: #f9c922;\n\t\t\t\t-webkit-animation: spin 1.5s linear infinite;\n\t\t\t\tanimation: spin 1.5s linear infinite;\n\t\t\t}\n\t\t\t.moff-hidden {\n\t\t\t\tdisplay: none;\n\t\t\t}\n\t\t\t@-webkit-keyframes spin {\n\t\t\t\t0% {\n\t\t\t\t\t-webkit-transform: rotate(0deg);\n\t\t\t\t\t-ms-transform: rotate(0deg);\n\t\t\t\t\ttransform: rotate(0deg);\n\t\t\t\t}\n\t\t\t\t100% {\n\t\t\t\t\t-webkit-transform: rotate(360deg);\n\t\t\t\t\t-ms-transform: rotate(360deg);\n\t\t\t\t\ttransform: rotate(360deg);\n\t\t\t\t}\n\t\t\t}\n\t\t\t@keyframes spin {\n\t\t\t\t0% {\n\t\t\t\t\t-webkit-transform: rotate(0deg);\n\t\t\t\t\t-ms-transform: rotate(0deg);\n\t\t\t\t\ttransform: rotate(0deg);\n\t\t\t\t}\n\t\t\t\t100% {\n\t\t\t\t\t-webkit-transform: rotate(360deg);\n\t\t\t\t\t-ms-transform: rotate(360deg);\n\t\t\t\t\ttransform: rotate(360deg);\n\t\t\t\t}\n\t\t\t}\n\t\t'));
		document.querySelector('head').appendChild(style);
	}
	function addPreloader() {
		_loader2 = _doc.createElement('div');
		_loaderBox = _doc.createElement('div');
		_loader2.setAttribute('class', 'moff-loader');
		_loaderBox.setAttribute('class', 'moff-loader_box');
		_doc.body.appendChild(_loader2);
		_loader2.appendChild(_loaderBox);
	}
	this.getPreloader = function () {
		return _loader2;
	};
	this.showPreloader = function () {
		var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
		this.hidePreloader();
		this.addClass(_loader2, '__visible');
		if (position) {
			this.addClass(_loader2, '__default');
		}
		if (!_moff.detect.supportCSS3('transition')) {
			this.addClass(_loader2, '__ie9-preloader');
		}
	};
	this.hidePreloader = function () {
		this.removeClass(_loader2, '__visible __default __ie9-preloader');
		_loader2.removeAttribute('style');
	};
	this.positionPreloader = function (x, y) {
		this.showPreloader(false);
		if (typeof x === 'number' && typeof y === 'number') {
			var style = '';
			if (_moff.detect.supportCSS3('transition')) {
				var coords = x + 'px, ' + y + 'px';
				style = '-webkit-transform: translate(' + coords + ');\n\t\t\t\t-moz-transform: translate(' + coords + ');\n\t\t\t\t-o-transform: translate(' + coords + ');\n\t\t\t\ttransform: translate(' + coords + ');';
			} else {
				// For IE 9.0
				style = 'left: ' + x + 'px; top: ' + y + 'px';
				this.addClass(_loader2, '__ie9-preloader');
			}
			_loader2.setAttribute('style', style);
		}
	};
	this.addClass = function (element, names) {
		if (!element) {
			return;
		}
		var names = names.split(/\s/);
		var len = names.length;
		var c = 0;
		var name, elemClass;
		elemClass = ' ' + element.className + ' ';
		for (; c < len; c++) {
			name = names[c];
			if (elemClass.indexOf(' ' + name + ' ') < 0) {
				elemClass += name + ' ';
			}
		}
		element.className = elemClass.trim();
	};
	this.removeClass = function (element, names) {
		if (!element) {
			return;
		}
		var names = names ? names.split(/\s/) : [];
		var len = names.length;
		var elemClass = element.className || '';
		var c = 0;
		for (; c < len; c++) {
			var regExp = new RegExp('(^| )' + names[c] + '( |$)');
			elemClass = elemClass.replace(regExp, ' ');
		}
		if (element.className == elemClass && !len) {
			elemClass = '';
		}
		element.className = elemClass.trim();
		return element;
	};
	/**
  * Window resize or matchMedia event listener handler.
  * @function resizeHandler
  * @param {object} mql - MediaQueryList object
  */
	function resizeHandler(mql) {
		if (_matchMediaSupport && mql.matches || viewModeIsChanged()) {
			setViewMode();
			_moff.runCallbacks(_changeViewCallbacks, _moff, [_moff.getMode()]);
			_moff.handleDataEvents();
		}
	}
	/**
  * Handle load events.
  * @method handleDataEvents
  */
	this.handleDataEvents = function () {
		loadByScreenSize();
		_moff.each(_doc.querySelectorAll(_dataAttrs.join(', ')), function () {
			var _this = this;
			var element = this;
			if (element.handled) {
				return;
			}
			var event = (element.getAttribute('data-load-event') || 'click').toLowerCase();
			if (Moff.detect.isMobile && event === 'click') {
				event = 'touchstart';
			}
			if (event === 'dom') {
				_moff.$(function () {
					handleLink(element);
				});
				// Element should be loaded on click in case DOMContentLoaded event is waiting too long
				event = 'click';
			} else if (event === 'scroll') {
				if (_moff.inViewport(element)) {
					handleLink(element);
				} else {
					_loadOnViewport.push(element);
				}
			} else if (event === 'click' || event === 'touchstart') {
				if (_settings.loadOnHover && !_moff.detect.isMobile) {
					element.addEventListener('mouseenter', function () {
						element = _this;
						var url = element.href || element.getAttribute('data-load-url');
						if (url) {
							url = removeHash(url);
							if (url) {
								url = handleUrlTemplate(element, url);
								load(url, function (data) {
									_cache[url] = data;
									// Clear cache each n seconds to prevent memory leak.
									setTimeout(function () {
										delete _cache[url];
									}, _settings.cacheLiveTime);
								});
							}
						}
					}, false);
				}
			}
			element.addEventListener(event, function (event) {
				handleLink(this);
				event.preventDefault();
			}, false);
			element.handled = true;
		});
	};
	/**
  * Check element for data load screen.
  * @function checkDataScreen
  * @param {object} element - HTML element
  * @returns {boolean} Return true if no data load screen
  */
	function checkDataScreen(element) {
		var screen = element.getAttribute('data-load-screen');
		var modes = screen.split(' ');
		return screen ? modes.length && modes.indexOf(_moff.getMode()) !== -1 : true;
	}
	/**
  * Extend Core settings
  * @function extendSettings
  */
	function extendSettings() {
		var settings = readSettings();
		_moff.each(settings, function (property, value) {
			_settings[property] = value;
		});
	}
	/**
  * Setup breakpoints for Media Queries.
  * @function setBreakpoints
  */
	function setBreakpoints() {
		if (_settings.breakpoints && _matchMediaSupport) {
			var breakpoints = _settings.breakpoints;
			_mqSmall = _mqSmall.replace('%d', breakpoints.sm);
			_mqMedium = _mqMedium.replace('%d', breakpoints.md);
			_mqLarge = _mqLarge.replace('%d', breakpoints.lg);
		}
	}
	/**
  * Determine whether view mode is changed
  * @function viewModeIsChanged
  * @returns {boolean}
  */
	function viewModeIsChanged() {
		return _lastViewMode !== _moff.getMode();
	}
	/**
  * Change last view mode.
  * @function setViewMode
  */
	function setViewMode() {
		_lastViewMode = _moff.getMode();
	}
	function scrollHandler() {
		if (!_loadOnViewport.length) {
			return;
		}
		var i = 0;
		var elements = _loadOnViewport.slice(0);
		var length = elements.length;
		for (; i < length; i++) {
			var element = elements[i];
			if (_moff.inViewport(element)) {
				// Remove element from array not to be handled twice
				_loadOnViewport.splice(i, 1);
				handleLink(element);
			}
		}
	}
	/**
  * Load data.
  * @param {string} url - Load url
  * @param {function} callback - Callback on success
  */
	function load(url, callback) {
		_moff.ajax({
			url: url,
			type: 'GET',
			crossDomain: isCrossDomainRequest(url),
			success: function success(data) {
				if (typeof callback === 'function') {
					callback(data);
				}
			}
		});
	}
	/**
  * Determine whether request is cross-domain
  * @param {string} url - Request url
  * @returns {boolean}
  */
	function isCrossDomainRequest(url) {
		var parser = document.createElement('a');
		parser.href = url;
		return _doc.domain !== parser.hostname;
	}
	/**
  * Links click event handler.
  * @function handleLink
  * @param {object} element - DOM element
  * @returns {boolean} false
  */
	function handleLink(element) {
		var title = element.title || '';
		var url = element.href || element.getAttribute('data-load-url');
		var target = element.getAttribute('data-load-target');
		var push = element.getAttribute('data-push-url');
		var loadModule = element.getAttribute('data-load-module');
		if (url) {
			_moff.showPreloader();
			url = handleUrlTemplate(element, url);
			// Remove data attributes not to handle twice
			element.removeAttribute('data-load-event');
			_moff.runCallbacks(_beforeLoad, element);
			if (_moff.detect.history && push !== null) {
				var id = Date.now();
				_win.history.pushState({ elemId: id, url: url }, title, url);
				_historyData[id] = element;
			}
			loadContent(element, url, target, function () {
				var targetElement = document.querySelector(target);
				// If element has data-load-module attribute include this module and then run after load callbacks.
				if (loadModule) {
					_moff.amd.include(loadModule, function () {
						_moff.hidePreloader();
						_moff.removeClass(targetElement, 'moff-hidden');
						_moff.runCallbacks(_afterLoad, element);
					});
				} else {
					_moff.hidePreloader();
					_moff.removeClass(targetElement, 'moff-hidden');
					_moff.runCallbacks(_afterLoad, element);
				}
			});
		} else if (loadModule) {
			_moff.showPreloader();
			_moff.amd.include(loadModule, function () {
				_moff.hidePreloader();
			});
		}
	}
	/**
  * Handle url for templates.
  * @function handleUrlTemplate
  * @param {object} element - DOM element
  * @param {string} url - Handled url
  * @returns {string} handled url
  */
	function handleUrlTemplate(element, url) {
		return url.replace(/\{\{(.*?)\}\}/g, function () {
			var attr = arguments[1];
			if (attr.indexOf('-') !== -1) {
				return element.getAttribute(attr);
			}
			return element[attr];
		});
	}
	/**
  * Load content and append into target.
  * @function loadContent
  * @param {object} element - DOM element
  * @param {string} url - Content URL
  * @param {string} target - Target element selector
  * @param {function} callback
  */
	function loadContent(element, url, target, callback) {
		url = removeHash(url);
		function applyContent(html) {
			var title = element.getAttribute('data-page-title');
			var targetElement = _doc.querySelector(target);
			if (targetElement !== null) {
				_moff.addClass(targetElement, 'moff-hidden');
				targetElement.innerHTML = html;
			}
			if (title) {
				_doc.title = title;
			}
			callback();
			// Handle events of new added elements
			_moff.handleDataEvents();
		}
		// If data is cached load it from cache
		if (_cache[url]) {
			applyContent(_cache[url]);
		} else {
			load(url, applyContent);
		}
	}
	/**
  * Window popstate event handler.
  * @function handlePopstate
  * @param {object} event - Event object
  */
	function handlePopstate(event) {
		var state = event.state;
		if (!state) {
			return;
		}
		var element = _historyData[state.elemId];
		if (element) {
			if (!checkDataScreen(element)) {
				return;
			}
			var url = state.url;
			var target = element.getAttribute('data-load-target');
			_moff.runCallbacks(_beforeLoad, element);
			loadContent(element, url, target, function () {
				_moff.runCallbacks(_afterLoad, element);
			});
		}
	}
	/**
  * Remove hash tag from URL.
  * @function removeHash
  * @param {string} url
  * @returns {string} URL w/o hash tag
  */
	function removeHash(url) {
		var index = url.indexOf('#');
		return index === -1 ? url : url.substr(0, index);
	}
	/**
  * Loads content of elements if data-load-screen set.
  * @function loadByScreenSize
  */
	function loadByScreenSize() {
		var screenAttribute = 'data-load-screen';
		_moff.each(_doc.querySelectorAll('[' + screenAttribute + ']'), function () {
			var element = this;
			if (checkDataScreen(element)) {
				element.removeAttribute(screenAttribute);
				element.handled = true;
				handleLink(element);
			}
		});
	}
	function nodeList(node) {
		var type = Object.prototype.toString.call(node);
		return _typeof(/^\[object (HTMLCollection|NodeList)\]$/.test(type)) && node.hasOwnProperty('length') && (node.length === 0 || _typeof(node[0]) === 'object' && node[0].nodeType > 0);
	}
	/**
  * Gets Moff settings
  * @function readSettings
  * @returns {{}}
  */
	function readSettings() {
		return window.moffConfig || {};
	}
	/**
  * Initialize Moff
  * @function init
  */
	function init() {
		_domIsLoaded = true;
		addPreloaderStyles();
		addPreloader();
		handleEvents();
		_moff.runCallbacks(_domLoadedCallbacks, this);
	}
	this.inViewport = function (element) {
		var top = element.offsetTop;
		var left = element.offsetLeft;
		var width = element.offsetWidth;
		var height = element.offsetHeight;
		while (element.offsetParent) {
			element = element.offsetParent;
			top += element.offsetTop;
			left += element.offsetLeft;
		}
		return top < _win.pageYOffset + _win.innerHeight && left < _win.pageXOffset + _win.innerWidth && top + height > _win.pageYOffset && left + width > _win.pageXOffset;
	};
	/**
  * Sends ajax request.
  * @method ajax
  * @param options
  */
	this.ajax = function (options) {
		var params = [];
		var data;
		// Make type upper case
		options.type = options.type.toUpperCase();
		// Set data object to send them as POST or GET params
		if (_typeof(options.data) === 'object') {
			data = options.data;
			this.each(data, function (key, value) {
				params.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
			});
			options.data = params.join('&');
		}
		// Here data has additional GET params
		// Object could not be send with GET method
		if (options.type === 'GET' && options.data) {
			options.url += (options.url.indexOf('?') !== -1 ? '&' : '?') + options.data.replace(/%20/g, '+');
			options.data = null;
		}
		var xhr = new XMLHttpRequest();
		xhr.open(options.type, options.url, true);
		xhr.setRequestHeader('Content-Type', options.contentType || 'application/x-www-form-urlencoded; charset=UTF-8');
		if (!options.crossDomain) {
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		}
		xhr.onload = function () {
			var status = this.status;
			if (status >= 200 && status < 300 || status === 304) {
				options.success(this.responseText, this);
			} else {
				options.error(this);
			}
		};
		xhr.send(options.data);
	};
	/**
  * Run callbacks in passed collections.
  * @method runCallbacks
  * @param {object} collection - Callbacks collection
  * @param {object} context - Callback context
  * @param {array} [args] - Callback arguments
  */
	this.runCallbacks = function (collection, context, args) {
		// Normalize collection
		if (!Array.isArray(collection)) {
			collection = [];
		}
		_moff.each(collection, function (i, callback) {
			if (typeof callback === 'function') {
				callback.apply(context, args);
			}
		});
	};
	/**
  * Add callbacks to view change event.
  * @method onViewChange
  * @param {function} callback - Callback assigned on view change
  */
	this.onViewChange = function (callback) {
		if (typeof callback !== 'function') {
			return;
		}
		_changeViewCallbacks.push(callback);
	};
	/**
  * Add callback before loading content.
  * @method beforeLoad
  * @param {function} callback
  */
	this.beforeLoad = function (callback) {
		if (typeof callback !== 'function') {
			return;
		}
		_beforeLoad.push(callback);
	};
	/**
  * Add callback after loading content.
  * @method afterLoad
  * @param {function} callback
  */
	this.afterLoad = function (callback) {
		if (typeof callback !== 'function') {
			return;
		}
		_afterLoad.push(callback);
	};
	/**
  * Get device view mode
  * @method getMode
  * @returns {string} view mode
  */
	this.getMode = function () {
		var viewMode = 'xs';
		if (_matchMediaSupport) {
			if (_matchMedia(_mqLarge).matches) {
				viewMode = 'lg';
			} else if (_matchMedia(_mqMedium).matches) {
				viewMode = 'md';
			} else if (_matchMedia(_mqSmall).matches) {
				viewMode = 'sm';
			}
		} else {
			var winWidth = _doc.documentElement.clientWidth;
			var breakpoints = _settings.breakpoints;
			if (winWidth >= breakpoints.lg) {
				viewMode = 'lg';
			} else if (winWidth >= breakpoints.md) {
				viewMode = 'md';
			} else if (winWidth >= breakpoints.sm) {
				viewMode = 'sm';
			}
		}
		return viewMode;
	};
	/**
  * Load files and run callback.
  * @method loadAssets
  * @param {object} depend - Object with js and css files to be loaded
  * @param {function} [callback] - Function executed after files be loaded
  * @param {object} [options] - Options of assets loading
  */
	this.loadAssets = function (depend, callback) {
		var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
		var loaded = 0;
		var length = 0;
		var jsIndex = 0;
		var isCSS = Array.isArray(depend.css);
		var isJS = Array.isArray(depend.js);
		var hasCallback = typeof callback === 'function';
		if (isJS) {
			length += depend.js.length;
		}
		if (isCSS) {
			length += depend.css.length;
		}
		if (!length) {
			if (hasCallback) {
				callback();
			}
			return;
		}
		function loadJSArray() {
			var src = depend.js[jsIndex];
			if (src) {
				_moff.loadJS(src, function () {
					jsIndex++;
					loaded++;
					if (loaded === length) {
						if (hasCallback) {
							callback();
						}
					} else {
						loadJSArray();
					}
				}, options);
			}
		}
		loadJSArray();
		function runCallback() {
			loaded++;
			if (loaded === length && hasCallback) {
				callback();
			}
		}
		if (isCSS && depend.css.length) {
			// Load depend css files
			this.each(depend.css, function (i, href) {
				_moff.loadCSS(href, runCallback, options);
			});
		}
	};
	/**
  * Load js file and run callback on load.
  * @method loadJS
  * @param {string} src - Array or path of loaded files
  * @param {function} [callback] - On load event callback
  * @param {object} [options] - Script load options
  */
	this.loadJS = function (src, callback) {
		var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
		if (typeof src !== 'string') {
			return;
		}
		// Normalize options
		if ((typeof callback === 'undefined' ? 'undefined' : _typeof(callback)) === 'object') {
			options = callback;
			callback = undefined;
		}
		var script = _doc.querySelector('script[src="' + src + '"]');
		var hasCallback = typeof callback === 'function';
		function appendScript() {
			var script = _doc.createElement('script');
			script.setAttribute('src', src);
			if (hasCallback) {
				script.addEventListener('load', callback, false);
			}
			_doc.querySelector('body').appendChild(script);
		}
		if (options.reload) {
			if (script) {
				script.parentNode.removeChild(script);
			}
			appendScript();
		} else if (!script) {
			appendScript();
		} else if (hasCallback) {
			callback();
		}
	};
	/**
  * Load css file and run callback on load.
  * @method loadCSS
  * @param {string} href - Array or path of loaded files
  * @param {function} [callback] - On load event callback
  * @param {object} [options] - Style load options
  */
	this.loadCSS = function (href, callback) {
		var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
		if (typeof href !== 'string') {
			return;
		}
		// Normalize options
		if ((typeof callback === 'undefined' ? 'undefined' : _typeof(callback)) === 'object') {
			options = callback;
			callback = undefined;
		}
		var link = _doc.querySelector('link[href="' + href + '"]');
		var hasCallback = typeof callback === 'function';
		function appendLink() {
			var link = _doc.createElement('link');
			if (hasCallback) {
				link.addEventListener('load', callback, false);
			}
			link.setAttribute('href', href);
			link.setAttribute('rel', 'stylesheet');
			_doc.querySelector('head').appendChild(link);
			link.onreadystatechange = function () {
				var state = link.readyState;
				if (state === 'loaded' || state === 'complete') {
					link.onreadystatechange = null;
					if (hasCallback) {
						callback();
					}
				}
			};
		}
		if (options.reload) {
			if (link) {
				link.parentNode.removeChild(link);
			}
			appendLink();
		} else if (!link) {
			appendLink();
		} else if (hasCallback) {
			callback();
		}
	};
	/**
  * Set or get Moff settings value.
  * @method settings
  * @param {string} key - Setting name
  * @param {*} value - Setting value
  * @returns {*}
  */
	this.settings = function (key, value) {
		if (typeof value === 'undefined') {
			return _settings[key];
		}
		_settings[key] = value;
	};
	/**
  * Iterates over object or array and run callback for each iteration.
  * @method each
  * @param {Array|object} object - Array or object to iterate over
  * @param {Function} callback - Iteration callback
  */
	this.each = function (object, callback) {
		var i = 0;
		var length = object.length;
		var isArray = Array.isArray(object) || nodeList(object);
		var value;
		if (isArray) {
			for (; i < length; i++) {
				value = callback.call(object[i], i, object[i]);
				if (value === false) {
					break;
				}
			}
		} else {
			for (i in object) {
				if (object.hasOwnProperty(i)) {
					value = callback.call(object[i], i, object[i]);
					if (value === false) {
						break;
					}
				}
			}
		}
	};
	/**
  * Adds callbacks for DOMContentLoaded event.
  * If event is occurred it runs callback.
  * @method $
  * @param {Function} arg - Callback function
  */
	this.$ = function (callback) {
		if (typeof callback !== 'function') {
			return;
		}
		if (_domIsLoaded) {
			callback();
		} else {
			_domLoadedCallbacks.push(callback);
		}
	};
	/**
  * Show debug notification. Removed in Moff production version.
  * @method debug
  * @namespace Moff
  * @param {*} message - A debug message to display
  */
	this.debug = function (message) {
		if (window.console && window.console.debug) {
			window.console.debug('Moff DEBUG: ' + message);
		}
	};
	/**
  * Display error with stack.
  * @method error
  */
	this.error = function (error) {
		throw error;
	};
	/**
  * Moff version.
  * @type {string}
  */
	this.version = '1.12.2';
	extendSettings();
	setBreakpoints();
	setViewMode();
	_doc.addEventListener('DOMContentLoaded', init, false);
}
exports.default = Core;
},{}],3:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", {
	value: true
});
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
		_detect.touch = !!('ontouchstart' in _win || _win.DocumentTouch && _doc instanceof _win.DocumentTouch);
		_detect.applicationCache = !!_win.applicationCache;
		_detect.canvas = function () {
			var canvas = _doc.createElement('canvas');
			return !!(canvas.getContext && canvas.getContext('2d'));
		}();
		_detect.canvasText = !!(_detect.canvas && typeof _doc.createElement('canvas').getContext('2d').fillText === 'function');
		_detect.dragAndDrop = function () {
			var div = _doc.createElement('div');
			return 'draggable' in div || 'ondragstart' in div && 'ondrop' in div;
		}();
		_detect.hashChange = !!('onhashchange' in _win && (typeof _doc.documentMode === 'undefined' || _doc.documentMode > 7));
		_detect.history = !!(_win.history && history.pushState);
		_detect.postMessage = !!_win.postMessage;
		_detect.webSockets = !!('WebSocket' in _win || 'MozWebSocket' in _win);
		_detect.webWorkers = !!_win.Worker;
		_detect.audio = function () {
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
		}();
		_detect.video = function () {
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
		}();
		_detect.indexedDB = function () {
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
		}();
		_detect.localStorage = function () {
			try {
				localStorage.setItem(_detect.mode, _detect.mode);
				localStorage.removeItem(_detect.mode);
				return true;
			} catch (error) {
				return false;
			}
		}();
		_detect.sessionStorage = function () {
			try {
				sessionStorage.setItem(_detect.mode, _detect.mode);
				sessionStorage.removeItem(_detect.mode);
				return true;
			} catch (error) {
				return false;
			}
		}();
	}
	/**
  * Detect browser
  * @function detectBrowser
  */
	function detectBrowser() {
		var match = /(edge)[\/]([0-9\.]+)/.exec(_ua) || /(chrome)[ \/]([\w.]+)/.exec(_ua) || /(webkit)[ \/]([\w.]+)/.exec(_ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(_ua) || /(msie) ([\w.]+)/.exec(_ua) || /(trident).+ rv:([\d+.]+)/.exec(_ua) || _ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(_ua) || [];
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
	this.supportCSS3 = function (property) {
		var ucProp = property.charAt(0).toUpperCase() + property.slice(1);
		var props = (property + ' ' + 'Webkit Moz O ms'.split(' ').join(ucProp + ' ') + ucProp).split(' ');
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
exports.default = Detect;
},{}],4:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * Moff Event module.
 * @module Event.
 */
function Event() {
	/**
  * @private {{}} _eventStore - Events storage.
  * @private
  */
	var _eventStore = {};
	/**
  * Registers new event.
  * @method add
  * @param {string} name - Event name
  */
	this.add = function (name) {
		if (typeof _eventStore[name] === 'undefined') {
			_eventStore[name] = [];
		}
	};
	/**
  * Assign callback for event.
  * @method on
  * @param {string} name - Event name
  * @param {function} callback - Event callback
  */
	this.on = function (name, callback) {
		// Create event if it does not exist.
		this.add(name);
		if (typeof callback === 'function') {
			_eventStore[name].push(callback);
		}
	};
	/**
  * Assign callback for event.
  * Callback will be removed after first execution.
  * @method once
  * @param {string} name - Event name
  * @param {function} callback - Event callback
  */
	this.once = function (name, callback) {
		callback._onceExecuted = true;
		this.on(name, callback);
	};
	/**
  * Trigger event by name.
  * @method trigger
  * @param {string} name - Event name
  */
	this.trigger = function (name) {
		var event = this;
		var args = Array.prototype.slice.call(arguments, 1);
		var indexes = [];
		if (typeof _eventStore[name] !== 'undefined') {
			Moff.runCallbacks(_eventStore[name], this, args);
			Moff.each(_eventStore[name], function (index, handler) {
				if (handler._onceExecuted) {
					indexes.push(index);
				}
			});
			// Remove one time executed handlers
			Moff.each(indexes, function (index, number) {
				event.off(name, _eventStore[name][number]);
			});
		}
	};
	/**
  * Get event from store.
  * @param {string} name - Event name
  * @returns {Array|undefined}
  */
	this.get = function (name) {
		var event = _eventStore[name];
		if (Array.isArray(event) && event.length) {
			return event;
		}
		return undefined;
	};
	/**
  * Removes event handler
  * @method off
  * @param {string} name - Event name
  * @param {function} handler - Event handler
  */
	this.off = function (name, handler) {
		if (!handler) {
			_eventStore[name] = [];
			return;
		}
		Moff.each(_eventStore[name], function (index, callback) {
			if (callback === handler) {
				_eventStore[name].splice(index, 1);
				return false;
			}
		});
	};
}
exports.default = Event;
},{}],5:[function(require,module,exports){
'use strict';
var _amd = require('../../amd/src/amd.e6');
var _amd2 = _interopRequireDefault(_amd);
var _core = require('../../core/src/core.e6');
var _core2 = _interopRequireDefault(_core);
var _event = require('../../event/src/event.e6');
var _event2 = _interopRequireDefault(_event);
var _detect = require('../../detect/src/detect.e6');
var _detect2 = _interopRequireDefault(_detect);
var _base = require('../../modules/src/base.es6');
var _base2 = _interopRequireDefault(_base);
var _api = require('../../modules/src/api.e6');
var _api2 = _interopRequireDefault(_api);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
window.Moff = new _core2.default();
window.Moff.amd = new _amd2.default();
window.Moff.event = new _event2.default();
window.Moff.Module = new _base2.default();
window.Moff.detect = new _detect2.default();
window.Moff.modules = new _api2.default();
},{"../../amd/src/amd.e6":1,"../../core/src/core.e6":2,"../../detect/src/detect.e6":3,"../../event/src/event.e6":4,"../../modules/src/api.e6":6,"../../modules/src/base.es6":7}],6:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * Register and control new Moff modules.
 * @module Module.
 */
function ModulesApi() {
	/**
  * @private {{}} _moduleObjectStorage - Modules storage.
  */
	var _moduleObjectStorage = {};
	/**
  * @private {{}} _moduleClassStorage - Classes storage.
  */
	var _moduleClassStorage = {};
	/**
  * Register module events
  * @param {Array} events - Array of events
  */
	function registerModuleEvents(events) {
		if (Array.isArray(events)) {
			Moff.each(events, function (index, event) {
				Moff.event.add(event);
			});
		}
	}
	/**
  * Creates new module class.
  * @method create
  * @param {string} name - module name
  * @param {object} [depend] - object of js and css files
  * @param {function} Constructor - constructor
  */
	this.create = function (name, depend, Constructor, extendFrom) {
		if (typeof extendFrom === 'undefined' && typeof Constructor === 'undefined' && typeof depend === 'function') {
			Constructor = depend;
			depend = undefined;
		} else if (typeof extendFrom === 'undefined' && typeof Constructor === 'function' && typeof depend === 'function') {
			extendFrom = Constructor;
			Constructor = depend;
			depend = undefined;
		}
		if (extendFrom) {
			Constructor.prototype = new extendFrom();
		} else {
			Constructor.prototype = Moff.Module;
		}
		Constructor.prototype.constructor = Constructor;
		// Save module in storage
		if (typeof _moduleClassStorage[name] === 'undefined') {
			_moduleClassStorage[name] = {
				constructor: Constructor,
				depend: depend
			};
		}
	};
	/**
  * Initialize registered class
  * @method initClass
  * @param {string} ClassName - Name of registered class
  * @param {object} [params] - Object with additional params
  */
	this.initClass = function (ClassName, params) {
		var moduleObject = _moduleClassStorage[ClassName];
		if (!moduleObject) {
			return;
		}
		function initialize() {
			// Create new class object
			var classObject = new moduleObject.constructor();
			var storedObject = _moduleObjectStorage[ClassName];
			// Store objects in array if there are more then one classes
			if (Array.isArray(storedObject)) {
				storedObject.push(classObject);
			} else if (typeof storedObject !== 'undefined') {
				_moduleObjectStorage[ClassName] = [storedObject, classObject];
			} else {
				_moduleObjectStorage[ClassName] = classObject;
			}
			if (typeof classObject.beforeInit === 'function') {
				classObject.beforeInit();
			}
			if (params) {
				// Apply all passed data
				Moff.each(params, function (key, value) {
					classObject[key] = value;
				});
			}
			// Add module name
			classObject.moduleName = ClassName;
			if (Array.isArray(classObject.events) && classObject.events.length) {
				// Register module events.
				registerModuleEvents(classObject.events);
			}
			// Set module scope
			classObject.setScope();
			if (typeof classObject.init === 'function') {
				classObject.init();
			}
			if (typeof classObject.afterInit === 'function') {
				classObject.afterInit();
			}
		}
		try {
			if (moduleObject.depend) {
				Moff.loadAssets(moduleObject.depend, initialize);
			} else {
				initialize();
			}
		} catch (error) {
			Moff.error(error);
		}
	};
	/**
  * Get registered module by name.
  * @method get
  * @param {string} name - Module name
  * @returns {object|Array|undefined} Module object or undefined
  */
	this.get = function (name) {
		return _moduleObjectStorage.hasOwnProperty(name) && _moduleObjectStorage[name] || undefined;
	};
	/**
  * Returns Module class
  * @method getClass
  * @param {String} name - module name
  * @returns {Function}
  */
	this.getClass = function (name) {
		var constructor = function constructor() {};
		if (_moduleClassStorage.hasOwnProperty(name)) {
			constructor = _moduleClassStorage[name];
		}
		return constructor;
	};
	/**
  * Returns all modules.
  * @method getAll
  * @returns {{}}
  */
	this.getAll = function () {
		return _moduleObjectStorage;
	};
	/**
  * Get modules by passed property.
  * @method getBy
  * @param {string} field - Module property name
  * @param {*} value - Property value
  * @returns {Array} Array of modules filtered by property
  */
	this.getBy = function (field, value) {
		var all = this.getAll();
		var result = [];
		// Normalize field
		if (field === 'class') {
			field = 'moduleName';
		}
		Moff.each(all, function (className, object) {
			if (Array.isArray(object)) {
				Moff.each(object, function (index, obj) {
					if (obj[field] && obj[field] === value) {
						result.push(obj);
					}
				});
			} else if (object[field] && object[field] === value) {
				result.push(object);
			}
		});
		return result;
	};
	/**
  * Remove registered module by name or instance.
  * @method remove
  * @param {string|object} module - Module Class name or instance.
  */
	this.remove = function (module) {
		var i = 0;
		var isInstance = typeof module !== 'string';
		var moduleName = isInstance ? module.moduleName : module;
		var storage = _moduleObjectStorage[moduleName];
		// Be sure to remove existing module
		if (Array.isArray(storage)) {
			var length = storage.length;
			for (; i < length; i++) {
				var object = storage[i];
				if (isInstance && object === module || !isInstance && object.moduleName === moduleName) {
					storage.splice(i, 1);
					length = storage.length;
					--i;
				}
			}
			if (storage.length === 1) {
				_moduleObjectStorage[moduleName] = _moduleObjectStorage[moduleName][0];
			} else if (!_moduleObjectStorage[moduleName].length) {
				delete _moduleObjectStorage[moduleName];
			}
		} else {
			delete _moduleObjectStorage[moduleName];
		}
	};
}
exports.default = ModulesApi;
},{}],7:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", {
	value: true
});
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
/**
 * Module base class.
 * @class ModuleBase
 * @constructor
 */
function ModuleBase() {
	/**
  * @property {null|string} scopeSelector - Module scope selector. CSS selector.
  */
	this.scopeSelector = null;
	/**
  * @property {null|object} scope - Module scope object. HTML element.
  */
	this.scope = null;
	/**
  * @property {Array} events - Array of module events.
  */
	this.events = [];
	/**
  * @property {Function} beforeInit - Before initialization callback
  */
	this.beforeInit = function () {};
	/**
  * @property {Function} init - Initialization callback
  */
	this.init = function () {};
	/**
  * @property {Function} afterInit - After initialization callback
  */
	this.afterInit = function () {};
	/**
  * Register module scope by scope selector.
  * @method setScope
  */
	this.setScope = function () {
		if (this.scopeSelector) {
			this.scope = document.querySelector(this.scopeSelector);
		}
	};
	/**
  * Find element in module scope.
  * @method find
  * @param {string} selector - CSS selector.
  * @returns {object} HTML element.
  */
	this.find = function (selector) {
		return this.scope.querySelectorAll(selector);
	};
	/**
  * Extends constructor's prototype with additional properties and functions
  * @method reopen
  * @param {{}} additions - Additional methods and properties
  */
	this.reopen = function (additions) {
		var _this = this;
		if ((typeof additions === 'undefined' ? 'undefined' : _typeof(additions)) !== 'object') {
			return;
		}
		Moff.each(additions, function (property, value) {
			_this[property] = value;
		});
	};
}
exports.default = ModuleBase;
},{}]},{},[5]);
