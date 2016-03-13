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
	var _loader = null;

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
	 * @property {string} _dataEvent - Data load event selector.
	 * @private
	 */
	var _dataEvent = 'data-load-target';

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
		style.appendChild(document.createTextNode(`
			.moff-loader {
				display: none;
				position: absolute;
				width: 50px;
				height: 50px;
				left: 0;
				top: 0;
				z-index: 9999;
				-webkit-transition: 0s ease-in;
				-moz-transition: 0s ease-in;
				-o-transition: 0s ease-in;
				transition: 0s ease-in;
			}
			.moff-loader.__default {
				top: 12px;
				left: 50%;
				margin-left: -25px;
				position: fixed;
			}
			.moff-loader.__ie9-preloader {
				background: url('http://moffjs.com/images/ie9-preloader.gif');
			}
			.moff-loader.__ie9-preloader .moff-loader_box {
				display: none;

			}
			.moff-loader.__visible {
				display: block;
			}
			.moff-loader_box {
				position: absolute;
				width: 100%;
				height: 100%;
				border-radius: 50%;
				border: 1px solid transparent;
				border-top-color: #3498db;
				-webkit-animation: spin 2s linear infinite;
				animation: spin 2s linear infinite;
			}
			.moff-loader_box:before {
				content: "";
				position: absolute;
				top: 2px;
				left: 2px;
				right: 2px;
				bottom: 2px;
				border-radius: 50%;
				border: 1px solid transparent;
				border-top-color: #e74c3c;
				-webkit-animation: spin 3s linear infinite;
				animation: spin 3s linear infinite;
			}
			.moff-loader_box:after {
				content: "";
				position: absolute;
				top: 5px;
				left: 5px;
				right: 5px;
				bottom: 5px;
				border-radius: 50%;
				border: 1px solid transparent;
				border-top-color: #f9c922;
				-webkit-animation: spin 1.5s linear infinite;
				animation: spin 1.5s linear infinite;
			}
			@-webkit-keyframes spin {
				0% {
					-webkit-transform: rotate(0deg);
					-ms-transform: rotate(0deg);
					transform: rotate(0deg);
				}
				100% {
					-webkit-transform: rotate(360deg);
					-ms-transform: rotate(360deg);
					transform: rotate(360deg);
				}
			}
			@keyframes spin {
				0% {
					-webkit-transform: rotate(0deg);
					-ms-transform: rotate(0deg);
					transform: rotate(0deg);
				}
				100% {
					-webkit-transform: rotate(360deg);
					-ms-transform: rotate(360deg);
					transform: rotate(360deg);
				}
			}
		`));

		document.querySelector('head').appendChild(style);
	}

	function addPreloader() {
		_loader = _doc.createElement('div');
		_loaderBox = _doc.createElement('div');

		_loader.setAttribute('class', 'moff-loader');
		_loaderBox.setAttribute('class', 'moff-loader_box');

		_doc.body.appendChild(_loader);
		_loader.appendChild(_loaderBox);
	}

	this.showPreloader = function(position = true) {
		this.hidePreloader();
		var className = _loader.className;

		if (className.indexOf('__visible') === -1) {
			className += ' __visible';
		}

		if (position && className.indexOf('__default') === -1) {
			className += ' __default';
		}

		if (!_moff.detect.supportCSS3('transition')) {
			className += ' __ie9-preloader';
		}

		_loader.setAttribute('class', className);
	};

	this.hidePreloader = function() {
		var className = _loader.className.replace(/(^| )__visible( |$)/, ' ');
		className = className.replace(/(^| )__default( |$)/, ' ');
		className = className.replace(/(^| )__ie9-preloader( |$)/, ' ');

		_loader.setAttribute('class', className.trim());
		_loader.removeAttribute('style');
	};

	this.positionPreloader = function(x, y) {
		this.showPreloader(false);

		if (typeof x === 'number' && typeof y === 'number') {

			var style = '';

			if (_moff.detect.supportCSS3('transition')) {
				let coords = `${x}px, ${y}px`;
				style = `-webkit-transform: translate(${coords});
				-moz-transform: translate(${coords});
				-o-transform: translate(${coords});
				transform: translate(${coords});`;
			} else {
				// for IE 9.0
				style = `left: ${x}px; top: ${y}px`;
				_loader.className = `${_loader.className} __ie9-preloader`;
			}

			_loader.setAttribute('style', style);
		}
	};

	/**
	 * Window resize or matchMedia event listener handler.
	 * @function resizeHandler
	 * @param {object} mql - MediaQueryList object
	 */
	function resizeHandler(mql) {
		if ((_matchMediaSupport && mql.matches) || viewModeIsChanged()) {
			setViewMode();

			_moff.runCallbacks(_changeViewCallbacks, _moff, [_moff.getMode()]);
			_moff.handleDataEvents();
		}
	}

	/**
	 * Handle load events.
	 * @method handleDataEvents
	 */
	this.handleDataEvents = function() {
		loadByScreenSize();

		_moff.each(_doc.querySelectorAll(`[${_dataEvent}]`), function() {
			let element = this;

			if (element.handled) {
				return;
			}

			let event = (element.getAttribute('data-load-event') || 'click').toLowerCase();

			if (event === 'dom') {
				_moff.$(function () {
					handleLink(element);
				});
			} else if (event === 'scroll') {
				if (_moff.inViewport(element)) {
					handleLink(element);
				} else {
					_loadOnViewport.push(element);
				}
			} else {
				if (event === 'click' && _settings.loadOnHover && !_moff.detect.isMobile) {
					element.addEventListener('mouseenter', function() {
						element = this;
						let url = element.href || element.getAttribute('data-load-url');
						url = removeHash(url);

						if (url) {
							url = handleUrlTemplate(element, url);

							load(url, function(data) {
								_cache[url] = data;

								// Clear cache each n seconds to prevent memory leak.
								setTimeout(function() {
									delete _cache[url];
								}, _settings.cacheLiveTime);
							});
						}
					}, false);
				}

				element.addEventListener(event, function(event) {
					handleLink(this);
					event.preventDefault();
				}, false);
			}

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
		return screen ? (modes.length && modes.indexOf(_moff.getMode()) !== -1) : true;
	}

	/**
	 * Extend Core settings
	 * @function extendSettings
	 */
	function extendSettings() {
		var settings = readSettings();

		_moff.each(settings, function(property, value) {
			_settings[property] = value;
		});
	}

	/**
	 * Setup breakpoints for Media Queries.
	 * @function setBreakpoints
	 */
	function setBreakpoints() {
		if (_settings.breakpoints && _matchMediaSupport) {
			let breakpoints = _settings.breakpoints;
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
			let element = elements[i];

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
			url,
			type: 'GET',
			success: function(data) {
				if (typeof callback === 'function') {
					callback(data);
				}
			}
		});
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

			if (_moff.detect.history && push) {
				let id = Date.now();
				_win.history.pushState({elemId: id, url: url}, title, url);
				_historyData[id] = element;
			}

			loadContent(element, url, target, function() {
				_moff.hidePreloader();
				// If element has data-load-module attribute
				// include this module and then run after load callbacks.
				if (loadModule) {
					_moff.amd.include(loadModule, function() {
						_moff.runCallbacks(_afterLoad, element);
					});
				} else {
					_moff.runCallbacks(_afterLoad, element);
				}
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
		return url.replace(/\{\{(.*?)\}\}/g, function() {
			return element.getAttribute(arguments[1]);
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
			let title = element.getAttribute('data-page-title');
			_doc.querySelector(target).innerHTML = html;

			if (title) {
				_doc.title = title;
			}

			// Handle events of new added elements
			_moff.handleDataEvents();
			callback();
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
			loadContent(element, url, target, function() {
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

		_moff.each(_doc.querySelectorAll(`[${screenAttribute}]`), function() {
			let element = this;

			if (checkDataScreen(element)) {
				element.removeAttribute(screenAttribute);
				handleLink(element);
			}
		});
	}

	function nodeList(node) {
		var type = Object.prototype.toString.call(node);

		return typeof /^\[object (HTMLCollection|NodeList)\]$/.test(type)
			&& node.hasOwnProperty('length')
			&& (node.length === 0 || (typeof node[0] === 'object' && node[0].nodeType > 0));
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
		handleEvents();
		addPreloaderStyles();
		addPreloader();
		_moff.runCallbacks(_domLoadedCallbacks, this);
	}

	this.inViewport = function(element) {
		var top = element.offsetTop;
		var left = element.offsetLeft;
		var width = element.offsetWidth;
		var height = element.offsetHeight;

		while(element.offsetParent) {
			element = element.offsetParent;

			top += element.offsetTop;
			left += element.offsetLeft;
		}

		return (
			top < (_win.pageYOffset + _win.innerHeight) &&
			left < (_win.pageXOffset + _win.innerWidth) &&
			(top + height) > _win.pageYOffset &&
			(left + width) > _win.pageXOffset
		);
	};

	/**
	 * Sends ajax request.
	 * @method ajax
	 * @param options
	 */
	this.ajax = function(options) {
		var params = [];
		var data;

		// Make type upper case
		options.type = options.type.toUpperCase();

		// Set data object to send them as POST or GET params
		if (typeof options.data === 'object') {
			data = options.data;

			this.each(data, function(key, value) {
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
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

		xhr.onload = function() {
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
	this.runCallbacks = function(collection, context, args) {
		// Normalize collection
		if (!Array.isArray(collection)) {
			collection = [];
		}

		_moff.each(collection, function(i, callback) {
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
	this.onViewChange = function(callback) {
		if (typeof callback !== 'function') {
			this.debug('Moff.onViewChange callback must be a function');
			return;
		}

		_changeViewCallbacks.push(callback);
	};

	/**
	 * Add callback before loading content.
	 * @method beforeLoad
	 * @param {function} callback
	 */
	this.beforeLoad = function(callback) {
		if (typeof callback !== 'function') {
			this.debug('Moff.beforeLoad callback must be a function');
			return;
		}

		_beforeLoad.push(callback);
	};

	/**
	 * Add callback after loading content.
	 * @method afterLoad
	 * @param {function} callback
	 */
	this.afterLoad = function(callback) {
		if (typeof callback !== 'function') {
			this.debug('Moff.afterLoad callback must be a function');
			return;
		}

		_afterLoad.push(callback);
	};

	/**
	 * Get device view mode
	 * @method getMode
	 * @returns {string} view mode
	 */
	this.getMode = function() {
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
			let winWidth = _doc.documentElement.clientWidth;
			let breakpoints = _settings.breakpoints;

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
	this.loadAssets = function(depend, callback, options = {}) {
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
			Moff.debug('You must pass minimum one js or css file');
			if (hasCallback) {
				callback();
			}
			return;
		}

		function loadJSArray() {
			var src = depend.js[jsIndex];

			if (src) {
				_moff.loadJS(src, function() {
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
			this.each(depend.css, function(i, href) {
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
	this.loadJS = function(src, callback, options = {}) {
		if (typeof src !== 'string') {
			this.debug('Moff.loadJS source must be a string');
			return;
		}

		// Normalize options
		if (typeof callback === 'object') {
			options = callback;
			callback = undefined;
		}

		var script = _doc.querySelector(`script[src="${src}"]`);
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
	this.loadCSS = function(href, callback, options = {}) {
		if (typeof href !== 'string') {
			this.debug('Moff.loadCSS source must be a string');
			return;
		}

		// Normalize options
		if (typeof callback === 'object') {
			options = callback;
			callback = undefined;
		}

		var link = _doc.querySelector(`link[href="${href}"]`);
		var hasCallback = typeof callback === 'function';

		function appendLink() {
			var link = _doc.createElement('link');

			if (hasCallback) {
				link.addEventListener('load', callback, false);
			}

			link.setAttribute('href', href);
			link.setAttribute('rel', 'stylesheet');
			_doc.querySelector('head').appendChild(link);

			link.onreadystatechange = function() {
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
	this.settings = function(key, value) {
		if (typeof value === 'undefined') {
			return _settings[key];
		} else {
			_settings[key] = value;
		}
	};

	/**
	 * Iterates over object or array and run callback for each iteration.
	 * @method each
	 * @param {Array|object} object - Array or object to iterate over
	 * @param {Function} callback - Iteration callback
	 */
	this.each = function(object, callback) {
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
	this.$ = function(callback) {
		if (typeof callback !== 'function') {
			this.debug('Moff.$ argument must be a function');
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
	this.debug = function(message) {
		if (window.console && window.console.debug) {
			window.console.debug('Moff DEBUG: ' + message);
		}
	};

	/**
	 * Display error with stack.
	 * @method error
	 */
	this.error = function() {
		Error(arguments);
	};

	/**
	 * Moff version.
	 * @type {string}
	 */
	this.version = '{{version}}';

	extendSettings();
	setBreakpoints();
	setViewMode();
	_doc.addEventListener('DOMContentLoaded', init, false);

	/* Test-code */
	this._testonly = {
		_cache,
		_loader() {
			return _loader;
		}
	};
	/* End-test-code */
}

export default Core;
