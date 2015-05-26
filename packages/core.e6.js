/**
 * Moff class
 * @constructor
 */
function Core() {
	/**
	 * @property {Core} _moff - Link to Core object
	 * @private
	 */
	var _moff = this;

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
	 * @property {boolean} _windowIsLoaded - Flag to determine whether the window is loaded.
	 * @private
	 */
	var _windowIsLoaded = false;

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
	 * @property {object} _settings - Local default settings.
	 * @private
	 */
	var _settings = {
		breakpoints: {
			sm: 768,
			md: 992,
			lg: 1200
		},

		bootstrap: false,
		loadOnHover: true,
		cacheLiveTime: 2000
	};

	/**
	 * @property {string} _dataEvent - Data load event selector.
	 * @private
	 */
	var _dataEvent = '[data-load-target]';

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
		_win.addEventListener('load', windowLoadHandler, false);

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

		if (_moff.hashchange) {
			_win.addEventListener('hashchange', includeByHash, false);
		}

		_win.addEventListener('popstate', handlePopstate, false);
		_moff.handleDataEvents();
	}

	/**
	 * Window load event handler.
	 * @function windowLoadHandler
	 */
	function windowLoadHandler() {
		_windowIsLoaded = true;

		// Run includeRegister function to include files
		// registered as after window load and tagged in url hash tag or by screen size
		includeRegister();

		// Load deferred files.
		// These files included with MoFF.include method before window load event.
		_moff.each(_deferredObjects, function(i, obj) {
			_moff.include(obj.id, obj.callback);
		});
	}

	/**
	 * Window resize or matchMedia event listener handler.
	 * @function resizeHandler
	 * @param {object} mql - MediaQueryList object
	 */
	function resizeHandler(mql) {
		if ((_matchMediaSupport && mql.matches) || _moff.viewModeIsChanged()) {
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
		var element, event, url;

		_moff.each(_doc.querySelectorAll(_dataEvent), function() {
			element = this;
			if (element.handled) {
				return;
			}

			event = (element.getAttribute('data-load-event') || 'click').toLowerCase();

			if (event === 'dom') {
				if (checkDataScreen(element)) {
					handleLink(element);
				} else {
					// If load screen size does not fit, link should be handled with click event
					element.addEventListener('click', function() {
						handleLink(this);
					}, false);
				}
			} else if (event === 'scroll') {
				// @todo replace _visibleElements to another
				_visibleElements.push({
					element: element,
					handler: function() {
						if (checkDataScreen(element)) {
							handleLink(element);
						} else {
							// If load screen size does not fit, link should be handled with click event
							element.on('click' + _postfix, function() {
								handleLink(this);
							});
						}
					}
				});
			} else {
				if (event === 'click' && _settings.loadOnHover && !_moff.detect.isMobile) {
					element.addEventListener('mouseenter', function() {
						element = this;
						url = element.href || element.getAttribute('data-load-url');
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

			this.handled = true;
		});
	}

	/**
	 * Check element for data load screen.
	 * @function checkDataScreen
	 * @param {object} element - jQuery object
	 * @returns {boolean} Return true if no data load screen
	 */
	function checkDataScreen(element) {
		var screen = element.getAttribute('data-load-screen');
		return screen ? screen.split(' ').indexOf(_moff.getMode()) !== -1 : true;
	}

	/**
	 * Extend Core settings
	 * @param {object} settings - Core settings
	 */
	function extendSettings(settings) {
		var property;
		if (typeof settings === 'object') {
			for (property in settings) {
				if (settings.hasOwnProperty(property)) {
					_settings[property] = settings[property];
				}
			}
		}
	}

	/**
	 * Setup breakpoints for Media Queries.
	 * @function setBreakpoints
	 */
	function setBreakpoints() {
		var breakpoints;

		if (_settings.breakpoints && _matchMediaSupport) {
			breakpoints = _settings.breakpoints;
			_mqSmall = _mqSmall.replace('%d', breakpoints.sm);
			_mqMedium = _mqMedium.replace('%d', breakpoints.md);
			_mqLarge = _mqLarge.replace('%d', breakpoints.lg);
		}
	}

	/**
	 * Change last view mode.
	 * @function setViewMode
	 */
	function setViewMode() {
		_lastViewMode = _moff.getMode();
	}

	/**
	 * Handler to load registered files by hash tag.
	 * @function includeByHash
	 */
	function includeByHash() {
		var hash = getHash();

		if (_registeredFiles.hasOwnProperty(hash)) {
			_moff.include(hash);
		}
	}

	/**
	 * Handler to load registered files by screen size.
	 * @function includeByScreenSize
	 */
	function includeByScreenSize() {
		var screenMode = _moff.getMode();

		_moff.each(_registeredFiles, function(id, obj) {
			if (obj.loadOnScreen.indexOf(screenMode) !== -1) {
				_moff.include(id);
			}
		});
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
		var id;

		if (url) {
			url = handleUrlTemplate(element, url);
			// Remove data attributes not to handle twice
			element.removeAttribute('data-load-event');
			_moff.runCallbacks(_beforeLoad, element);

			if (_moff.history && push !== undefined) {
				id = Date.now();
				_win.history.pushState({elemId: id, url: url}, title, url);
				_historyData[id] = element;
			}

			loadContent(element, url, target, function() {
				_moff.runCallbacks(_afterLoad, element);
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
			return element[arguments[1]]();
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
		var title;

		url = removeHash(url);

		function applyContent(html) {
			title = element.getAttribute('data-page-title');
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
		var state = event.originalEvent.state;
		var element;

		if (!state) {
			return;
		}

		element = _historyData[state.elemId];
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
	 * Get hash tag form URL.
	 * @function getHash
	 * @param {string} [url]
	 * @returns {sting} Hash tag
	 */
	function getHash(url) {
		if (url) {
			var hashPoint = url.indexOf('#');
			return hashPoint !== -1 ? url.substr(hashPoint + 1) : '';
		}

		return _win.location.hash.substr(1);
	}

	/**
	 * Check url hash tag to load registered files.
	 * @function includeRegister
	 */
	function includeRegister() {
		includeByHash();
		includeByScreenSize();
	}

	function nodeList(node) {
		var type = Object.prototype.toString.call(node);

		return typeof /^\[object (HTMLCollection|NodeList)\]$/.test(type)
			&& node.hasOwnProperty('length')
			&& (node.length === 0 || (typeof node[0] === 'object' && node[0].nodeType > 0));
	}

	/**
	 * Run initialisation of base handlers
	 * @method init
	 * @param {object} [settings] - Core settings
	 */
	this.init = function(settings) {
		// Normalize settings
		if (!settings) {
			settings = {};
		}

		_doc.addEventListener('DOMContentLoaded', function() {
			extendSettings(settings);
			setBreakpoints();
			setViewMode();
			handleEvents();
			includeRegister();
		}, false);
	};

	/**
	 * Check for CSS3 property support.
	 * @method supportCSS3
	 * @param {string} property - CSS3 property
	 * @returns {boolean}
	 */
	this.supportCSS3 = function(property) {
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

	this.ajax = function(options) {
		var params = [];
		var key, data;

		// Make type upper case
		options.type = options.type.toUpperCase();

		// Set data object to send them as POST or GET params
		if (typeof options.data === 'object') {
			data = options.data;

			for (key in data) {
				if (data.hasOwnProperty(key)) {
					params.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
				}
			}
			options.data = params.join('&');
		}

		// Here data has additional GET params
		// Object could not be send with GET method
		if(options.type === 'GET' && options.data) {
			options.url += (options.url.indexOf('?') !== -1 ? '&' : '?') + options.data.replace(/%20/g, '+');
			options.data = null;
		}

		var xhr = new XMLHttpRequest();
		xhr.open(options.type, options.url, true);

		xhr.setRequestHeader('Content-Type', options.contentType || 'application/x-www-form-urlencoded; charset=UTF-8');
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

		xhr.onload = function() {
			var status = this.status;
			if(status >= 200 && status < 300 || status === 304) {
				options.success(this.response, this);
			}
			else {
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
	 */
	this.runCallbacks = function(collection, context, args) {
		// Normalize collection
		if (!Array.isArray(collection)) {
			collection = [];
		}

		// Normalize arguments
		if (typeof args === 'undefined') {
			args = [];
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
		if (typeof callback === 'function') {
			_changeViewCallbacks.push(callback);
		}
	};

	/**
	 * Add callback before loading content.
	 * @method beforeLoad
	 * @param {function} callback
	 */
	this.beforeLoad = function(callback) {
		_beforeLoad.push(callback);
	};

	/**
	 * Add callback after loading content.
	 * @method afterLoad
	 * @param {function} callback
	 */
	this.afterLoad = function(callback) {
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
		}

		return viewMode;
	};

	/**
	 * Register files to be loaded files.
	 * @method register
	 * @param {object} obj - Registered object
	 */
	this.register = function(obj) {
		// Normalize obj properties
		_registeredFiles[obj.id] = {
			loaded: false,
			depend: {
				js: obj.depend && obj.depend.js || [],
				css: obj.depend && obj.depend.css || []
			},
			files: {
				js: obj.files && obj.files.js || [],
				css: obj.files && obj.files.css || []
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
	 */
	this.include = function(id, callback) {
		var register = _registeredFiles[id];

		// Make sure files are not loaded
		if (register.loaded) {
			return;
		}

		// Make sure to load after window load if onWindowLoad is set
		if (register.onWindowLoad && !_windowIsLoaded) {
			// Save id to load after window load
			_deferredObjects.push({id: id, callback: callback});
			return;
		}

		// Mark as loaded
		register.loaded = true;

		if (typeof register.beforeInclude === 'function') {
			register.beforeInclude();
		}

		function loadFiles() {
			_moff.loadAssets(register.files, execCallback);
		}

		this.loadAssets(register.depend, loadFiles);

		function execCallback() {
			if (typeof register.afterInclude === 'function') {
				register.afterInclude();
			}

			if (typeof callback === 'function') {
				callback();
			}
		}
	};

	/**
	 * Load files and run callback.
	 * @method loadAssets
	 * @param {object} depends - Object with js and css files to be loaded
	 * @param {function} callback - Function executed after files be loaded
	 */
	this.loadAssets = function(depends, callback) {
		var loaded = 0;
		var length = 0;
		var isCSS = Array.isArray(depends.css);
		var isJS = Array.isArray(depends.js);

		if (isJS) {
			length += depends.js.length;
		}

		if (isCSS) {
			length += depends.css.length;
		}

		function runCallback() {
			loaded++;
			if (loaded === length) {
				callback();
			}
		}

		if (isJS && depends.js.length) {
			// Load depend js files
			this.each(depends.js, function(i, src) {
				_moff.loadJS(src, runCallback);
			});

		}

		if (isCSS && depends.css.length) {
			// Load depend css files
			this.each(depends.css, function(i, href) {
				_moff.loadCSS(href, runCallback);
			});
		}

		if (!length) {
			callback();
		}
	};

	/**
	 * Load js file and run callback on load.
	 * @method loadJS
	 * @param {string} src - Array or path of loaded files
	 * @param {function} [callback] - On load event callback
	 */
	this.loadJS = function(src, callback) {
		if (typeof src !== 'string') {
			window.console.warn('Moff.loadJS source is not a string');
			return;
		}

		var script;
		var hasCallback = typeof callback === 'function';

		// Load script if it is not existing on the page
		if (!_doc.querySelector('script[src="' + src + '"]')) {
			// If set src attribute before append
			// jQuery will load script with ajax request
			script = _doc.createElement('script');

			if (hasCallback) {
				script.addEventListener('load', callback, false);
			}
			script.src = src;
			_doc.querySelector('body').appendChild(script);
		} else if (hasCallback) {
			callback();
		}
	};

	/**
	 * Load css file and run callback on load.
	 * @method loadCSS
	 * @param {string} href - Array or path of loaded files
	 * @param {function} callback - On load event callback
	 */
	this.loadCSS = function(href, callback) {
		if (typeof href !== 'string') {
			window.console.warn('Moff.loadCSS source is a string');
			return;
		}

		var link;
		var hasCallback = typeof callback === 'function';

		// Load link if it is not existing on the page
		if (!_doc.querySelector('link[href="' + href + '"]')) {
			link = _doc.createElement('link');

			if (hasCallback) {
				link.addEventListener('load', callback, false);
			}

			link.href = href;
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
		} else if (hasCallback) {
			callback();
		}
	};

	/**
	 * Extend Moff object.
	 * @method extend
	 * @param {string} name - Module name
	 * @param {function} Constructor - Module constructor
	 * @param {boolean} extend [optionally] - Extend from Moff prototype
	 */
	this.extend = function(name, Constructor, extend) {
		// Make sure not to override existing properties/methods
		if (!this.hasOwnProperty(name)) {
			if (extend) {
				Constructor.prototype = this;
				Constructor.prototype.constructor = Constructor;
			}

			this[name] = new Constructor();

			if (typeof this[name].init === 'function') {
				this[name].init();
			}
		}
	};

	/**
	 * Overwrites and adds object methods and properties.
	 * @method reopen
	 * @param {object} methods - Object of properties or methods
	 */
	this.reopen = function(methods) {
		if (typeof methods !== 'object') {
			window.console.warn('Reopen method argument must be an object');
			return;
		}

		var obj = this;
		obj.each(methods, function(property, value) {
			obj[property] = value;
		});
	};

	/**
	 * Extend classes.
	 * @method extendClass
	 * @param {function} child - Child constructor
	 * @param {function} Parent - Parent constructor
	 */
	this.extendClass = function(child, Parent) {
		function F() {}

		F.prototype = new Parent();
		child.prototype = new F();
		child.prototype.constructor = child;
		child.parentClass = Parent.prototype;
	};

	/**
	 * Determine whether view mode is changed
	 * @method viewModeIsChanged
	 * @returns {boolean}
	 */
	this.viewModeIsChanged = function() {
		return _lastViewMode !== this.getMode();
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
	 * Moff version.
	 * @type {string}
	 */
	this.version = '{{version}}';

	/* Test-code */
	this._testonly = {
		_deferredObjects: function() {
			return _deferredObjects;
		},

		_registeredFiles: function() {
			return _registeredFiles;
		},

		_cache: _cache
	};
	/* End-test-code */
}

export default Core;
