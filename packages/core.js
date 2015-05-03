/**
 * Moff class
 * @constructor
 */
function MoffClass() {
	/**
	 * @property {MoffClass} _moff - Link to MoffClass object
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
	 * @property {Array} _visibleElements - Elements to be visible.
	 * @private
	 */
	var _visibleElements = [];

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
	 * Local default settings.
	 * @type {{breakpoints: {sm: number, md: number, lg: number}}}
	 * @private
	 */
	var _settings = {
		/** Media Query break points. */
		breakpoints: {
			sm: 768,
			md: 992,
			lg: 1200
		}
	};

	/**
	 * @property {string} _postfix - Events postfix.
	 * @private
	 */
	var _postfix = '.moff';

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
		collectVisibleElements();

		$(_win)
			.on('load' + _postfix, windowLoadHandler)
			.on('scroll' + _postfix, windowScrollHandler);

		// Check for addListener method
		// because respond.js emulates matchMedia method
		if (_matchMediaSupport) {
			_matchMedia(_mqLarge).addListener(resizeHandler);
			_matchMedia(_mqMedium).addListener(resizeHandler);
			_matchMedia(_mqSmall).addListener(resizeHandler);
		} else {
			// If matchMedia is not supported use resize fallback
			$(_win).on('resize' + _postfix, resizeHandler);
		}

		if (_moff.hashchange) {
			$(_win).on('hashchange' + _postfix, includeByHash);
		}

		$(_win).on('popstate' + _postfix, handlePopstate);
		handleLoadEvents();

		// Call window scroll event handler to load visible elements
		windowScrollHandler();
	}

	/**
	 * Gather animated elements to be handled.
	 * @function collectVisibleElements
	 */
	function collectVisibleElements() {
		var element;

		$.each($('[data-visible-scroll]'), function() {
			element = $(this);

			_visibleElements.push({
				// Remove [data-visible-scroll] attribute not to be handled twice
				element: element.removeAttr('data-visible-scroll').css('opacity', 0),
				handler: function() {
					_moff.appear(element);
				}
			});
		});
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
		$.each(_deferredObjects, function(i, obj) {
			_moff.include(obj.id, obj.callback);
		});
	}

	/**
	 * Window scroll event handler.
	 * @function windowScrollHandler
	 */
	function windowScrollHandler() {
		if (!_visibleElements.length) {
			return;
		}

		var localVisible = _visibleElements.slice(0);
		$.each(localVisible, function(i, obj) {
			if (_moff.inViewport(obj.element)) {
				// Remove element from array not to be handled twice
				_visibleElements.splice(i, 1);
				obj.handler();
			}
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
			handleLoadEvents();
		}
	}

	/**
	 * Handle load events.
	 * @function handleLoadEvents
	 */
	function handleLoadEvents() {
		var element, event;

		$.each($(_dataEvent), function() {
			if (this.handled) {
				return;
			}

			element = $(this);
			event = (element.data('loadEvent') || 'click').toLowerCase();

			if (event === 'dom') {
				if (checkDataScreen(element)) {
					handleLink(this);
				} else {
					// If load screen size does not fit, link should be handled with click event
					element.on('click' + _postfix, function() {
						handleLink(this);
					});
				}
			} else if (event === 'scroll') {
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
				element.on(event + _postfix, function() {
					return handleLink(this);
				});
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
		var screen = element.data('loadScreen');
		return screen ? $.inArray(_moff.getMode(), screen.split(' ')) !== -1 : true;
	}

	/**
	 * Extend MoffClass settings
	 * @param {object} settings - MoffClass settings
	 */
	function extendSettings(settings) {
		$.extend(_settings, settings);
	}

	/**
	 * Setup breakpoints.
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

		$.each(_registeredFiles, function(id, obj) {
			if ($.inArray(screenMode, obj.loadOnScreen) !== -1) {
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
		$.ajax({
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
		element = $(element);

		var title = element.attr('title') || '';
		var url = element.attr('href') || element.data('loadUrl');
		var target = element.data('loadTarget');
		var push = element.data('pushUrl');

		if (url) {
			url = handleUrlTemplate(element, url);
			// Remove data attributes not to handle twice
			element.removeAttr('data-load-event');
			_moff.runCallbacks(_beforeLoad, element);

			if (_moff.history && push !== undefined) {
				var id = +new Date();
				_win.history.pushState({elemId: id, url: url}, title, url);
				_historyData[id] = element;
			}

			loadContent(element, url, target, function() {
				_moff.runCallbacks(_afterLoad, element);
			});
		}

		return false;
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
		var hash = getHash(url);
		var title;
		url = removeHash(url);

		load(url, function(html) {
			title = element.data('pageTitle');
			$(target).html(html);

			if (title) {
				_doc.title = title;
			}

			// Handle events of new added elements
			_moff.reusableEvents();
			callback();

			if (hash) {
				// Use document.getElementById to escape syntax error for jQuery selector
				var top = $(document.getElementById(hash)).add('a[name="' + hash + '"]');
				if (top.length) {
					$(_win).scrollTop(top.offset().top);
				}
			}
		});
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
		var target = element.data('loadTarget');

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

	/**
	 * Adds all Twitter Bootstrap patches.
	 * @function bootstrapPatches
	 */
	function bootstrapPatches() {
		var ua = navigator.userAgent;
		var windows8 = ua.match(/MSIE 10\.0; Windows NT 6\.2/);
		var windowsMobile = ua.match(/IEMobile\/10\.0/);
		var msViewportStyle, isAndroid;

		if (windows8 || windowsMobile) {
			msViewportStyle = '<style>@-webkit-viewport { width: device-width; }';
			msViewportStyle += '@-moz-viewport { width: device-width; }';
			msViewportStyle += '@-ms-viewport { width: ' + (windowsMobile ? 'auto' : 'device-width') + '; }';
			msViewportStyle += '@-o-viewport { width: device-width; }';
			msViewportStyle += '@viewport { width: device-width; }<\/style>';
			$('head').append($(msViewportStyle));
		}

		isAndroid = (ua.indexOf('Mozilla/5.0') > -1 && ua.indexOf('Android ') > -1 && ua.indexOf('AppleWebKit') > -1 && ua.indexOf('Chrome') === -1);
		if (isAndroid) {
			$('select.form-control').removeClass('form-control').css('width', '100%');
		}
	}

	/**
	 * @property {string} mode - Framework mode.
	 */
	this.mode = 'moff';

	/**
	 * Run initialisation of base handlers
	 * @method init
	 * @param {object} [settings] - MoffClass settings
	 */
	this.init = function(settings) {
		// Normalize settings
		if (!settings) {
			settings = {};
		}

		$(function() {
			extendSettings(settings);
			setBreakpoints();
			setViewMode();
			handleEvents();
			includeRegister();
			bootstrapPatches();
		});
	};

	/**
	 * Show element with transition effect.
	 * @method appear
	 * @param {object} element - DOM element
	 */
	this.appear = function(element, duration) {
		// Normalize duration
		duration = duration || 1;

		// Convert to milliseconds
		duration = duration * 1000;

		if (_moff.supportCSS3('transition')) {
			element.css({
				'-webkit-transition': 'opacity' + duration + 'ms',
				'-moz-transition': 'opacity' + duration + 'ms',
				'-o-transition': 'opacity' + duration + 'ms',
				transition: 'opacity' + duration + 'ms',
				opacity: 1
			});
		} else {
			// Fallback if browser does not support CSS3 transition
			element.animate({opacity: 1}, duration);
		}
	};

	/**
	 * Execute all reusable events.
	 * @method reusableEvents
	 */
	this.reusableEvents = function() {
		collectVisibleElements();
		handleLoadEvents();
		windowScrollHandler();
	};

	/**
	 * Determine whether element in view port.
	 * @method inViewport
	 * @param {object} element - DOM element
	 * @returns {boolean}
	 */
	this.inViewport = function(element) {
		var bounds;
		var win = $(_win);
		var viewport = {
			top: win.scrollTop(),
			left: win.scrollLeft()
		};

		element = $(element);
		viewport.right = viewport.left + win.width();
		viewport.bottom = viewport.top + win.height();

		bounds = element.offset();
		bounds.right = bounds.left + element.outerWidth();
		bounds.bottom = bounds.top + element.outerHeight();

		return !(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom);
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
			if (property.indexOf('-') === -1 && document.createElement(this.mode).style[property] !== undefined) {
				return true;
			}
		}

		return false;
	};

	/**
	 * Run callbacks in passed collections.
	 * @method runCallbacks
	 * @param {object} collection - Callbacks collection
	 * @param {object} context - Callback context
	 */
	this.runCallbacks = function(collection, context, args) {
		// Normalize collection
		if (!$.isArray(collection)) {
			collection = [];
		}

		// Normalize arguments
		if (typeof args === 'undefined') {
			args = [];
		}

		$.each(collection, function(i, callback) {
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

		if ($.isFunction(register.beforeInclude)) {
			register.beforeInclude();
		}

		function loadFiles() {
			_moff.loadDepends(register.files, execCallback);
		}

		this.loadDepends(register.depend, loadFiles);

		function execCallback() {
			if ($.isFunction(register.afterInclude)) {
				register.afterInclude();
			}

			if (typeof callback === 'function') {
				callback();
			}
		}
	};

	/**
	 * Load files and run callback.
	 * @method loadDepends
	 * @param {object} depends - Object with js and css files to be loaded
	 * @param {function} callback - Function executed after files be loaded
	 */
	this.loadDepends = function(depends, callback) {
		var loaded = 0;
		var length = 0;
		var isCSS = $.isArray(depends.css);
		var isJS = $.isArray(depends.js);

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
			this.loadJS(depends.js, runCallback);
		}

		if (isCSS && depends.css.length) {
			// Load depend css files
			this.loadCSS(depends.css, runCallback);
		}

		if (!length) {
			callback();
		}
	};

	/**
	 * Load js file and run callback on load.
	 * @method loadJS
	 * @param {array|string} files - Array or path of loaded files
	 * @param {function} [callback] - On load event callback
	 */
	this.loadJS = function(files, callback) {
		if (!$.isArray(files) && typeof files !== 'string') {
			window.console.warn('Moff.loadJS source is not an array or a string');
			return;
		}

		var script;
		var hasCallback = typeof callback === 'function';

		function includeScript(src) {
			// Load script if it is not existing on the page
			if (!$('script[src="' + src + '"]').length) {
				// If set src attribute before append
				// jQuery will load script with ajax request
				script = $('<script>');

				if (hasCallback) {
					script.on('load', callback);
				}

				script
					.appendTo($('body').length && $('body') || $('head'))
					.attr('src', src);
			} else if (hasCallback) {
				callback();
			}
		}

		if ($.isArray(files)) {
			$.each(files, function(index, src) {
				includeScript(src);
			});
		} else {
			includeScript(files);
		}
	};

	/**
	 * Load css file and run callback on load.
	 * @method loadCSS
	 * @param {array|string} files - Array or path of loaded files
	 * @param {function} callback - On load event callback
	 */
	this.loadCSS = function(files, callback) {
		if (!$.isArray(files) && typeof files !== 'string') {
			window.console.warn('Moff.loadCSS source is not array or string');
			return;
		}

		var link;
		var hasCallback = typeof callback === 'function';

		function includeStyle(href) {
			// Load link if it is not existing on the page
			if (!$('link[href="' + href + '"]').length) {
				var link = $('<link rel="stylesheet">');

				if (hasCallback) {
					link.on('load', callback);
				}

				link
					.attr('href', files)
					.appendTo('head');

				link = link[0];
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
		}

		if ($.isArray(files)) {
			$.each(files, function(index, href) {
				includeStyle(href);
			});
		} else {
			includeStyle(files);
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
		child.parentClass = parent.prototype;
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

	/**
	 * Moff version.
	 * @type {string}
	 */
	this.version = '{{version}}';

	/* test-code */
	this._testonly = {
		_visibleElements: function() {
			return _visibleElements;
		},

		_deferredObjects: function() {
			return _deferredObjects;
		},

		_registeredFiles: function() {
			return _registeredFiles;
		}
	};
	/* end-test-code */
}

export default MoffClass;
