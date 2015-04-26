(function() {
    "use strict";
    function $$core$$MoffClass() {
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
         * @param {function} callback - On load event callback
         */
        this.loadJS = function(files, callback) {
            if (!$.isArray(files) && typeof files !== 'string') {
                window.console.warn('Moff.loadJS source is not array or string');
                return;
            }

            function includeScript(src) {
                // If set src attribute before append
                // jQuery will load script with ajax request
                $('<script>')
                    .on('load', callback)
                    .appendTo($('body').length && $('body') || $('head'))
                    .attr('src', src);
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

            function includeStyle(href) {
                var link = $('<link rel="stylesheet">')
                    .on('load', callback)
                    .attr('href', files)
                    .appendTo('head');

                link = link[0];
                link.onreadystatechange = function() {
                    var state = link.readyState;
                    if (state === 'loaded' || state === 'complete') {
                        link.onreadystatechange = null;
                        callback();
                    }
                };
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
        this.version = '1.1.8';

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

    var $$core$$default = $$core$$MoffClass;
    function $$module$$Module() {
        'use strict';

        /**
         * @private {Module} _module - Link to object.
         * @private
         */
        var _module = this;

        /**
         * @private {{}} _moduleObjectStorage - Modules storage.
         * @private
         */
        var _moduleObjectStorage = {};

        /**
         * @private {{}} _moduleClassStorage - Classes storage.
         * @private
         */
        var _moduleClassStorage = {};

        /**
         * @private {{}} _eventStore - Events storage.
         * @private
         */
        var _eventStore = {};

        /**
         * Register module events
         * @param {array} events - Array of events
         */
        function registerModuleEvents(events) {
            if ($.isArray(events)) {
                $.each(events, function() {
                    _module.registerEvent(this);
                });
            }
        }

        /**
         * Register new module.
         * @method register
         * @param {string} name - module name
         * @param {array} depends - array of js and css files
         * @param {function} Constructor - constructor
         */
        this.register = function(name, depends, Constructor) {
            // Normalize arguments
            if (typeof Constructor === 'undefined') {
                Constructor = depends;
                depends = undefined;
            }

            // Register new module in the storage
            if (!_moduleClassStorage.hasOwnProperty(name)) {
                Constructor.prototype = _module;
                Constructor.prototype.constructor = Constructor;

                // Save module in storage
                if (typeof _moduleClassStorage[name] === 'undefined') {
                    _moduleClassStorage[name] = {
                        constructor: Constructor,
                        depends: depends
                    };
                }
            } else {
                window.console.warn(name + ' class has already registered.');
            }
        };

        /**
         * Initialize registered class
         * @method initClass
         * @param {string} ClassName - Name of registered class
         * @param {object} [params] - Object with additional params
         */
        this.initClass = function(ClassName, params) {
            var moduleObject = _moduleClassStorage[ClassName];

            function initialize() {
                // Create new class object
                var classObject = new moduleObject.constructor();
                var storedObject = _moduleObjectStorage[ClassName];

                // Store objects in array if there are more then one classes
                if ($.isArray(storedObject)) {
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
                    $.each(params, function(key, value) {
                        classObject[key] = value;
                    });
                }

                // Add module name
                classObject.moduleName = ClassName;

                // Register module events.
                registerModuleEvents(classObject.events);

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
                if (moduleObject.depends) {
                    this.loadDepends(moduleObject.depends, initialize);
                } else {
                    initialize();
                }
            } catch (error) {
                window.console.error(error);
            }
        };

        /**
         * Register new event.
         * @method registerEvent
         * @param {string} name - Event name
         */
        this.registerEvent = function(name) {
            if (typeof _eventStore[name] === 'undefined') {
                _eventStore[name] = [];
            }
        };

        /**
         * Assign callback for event.
         * @method assignForEvent
         * @param {string} name - Event name
         * @param {function} callback - Event callback
         */
        this.assignForEvent = function(name, callback) {
            if (!_eventStore.hasOwnProperty(name)) {
                window.console.warn(name + ' event is not registered yet.');
                return;
            }

            if (typeof callback === 'function') {
                _eventStore[name].push(callback);
            }
        };

        /**
         * Trigger event by name.
         * @method triggerEvent
         * @param {string} name - Event name
         */
        this.triggerEvent = function(name) {
            var args = Array.prototype.slice.call(arguments, 1);

            if (typeof _eventStore[name] !== 'undefined') {
                _module.runCallbacks(_eventStore[name], this, args);
            }
        };

        /**
         * Get registered module by name.
         * @method get
         * @param {string} name - module name
         * @return {object|undefined} module object or undefined
         */
        this.get = function(name) {
            return (_moduleObjectStorage.hasOwnProperty(name) && _moduleObjectStorage[name]) || undefined;
        };

        /**
         * Remove registered module by name.
         * @method remove
         */
        this.remove = function() {
            var name = this.moduleName;
            var id = this.id;

            // Be sure to remove existing module
            if ($.isArray(_moduleObjectStorage[name])) {
                $.each(_moduleObjectStorage[name], function(index, object) {
                    if (object.id && object.id === id) {
                        _moduleObjectStorage[name].splice(index, 1);
                    }
                });

                if (_moduleObjectStorage[name].length === 1) {
                    _moduleObjectStorage[name] = _moduleObjectStorage[name][0];
                }
            } else {
                delete _moduleObjectStorage[name];
            }
        };

        /**
         * Register module scope by scope selector.
         * @method setScope
         */
        this.setScope = function() {
            if (this.scopeSelector) {
                this.scope = $(this.scopeSelector);
            }
        };

        /**
         * Find element in module scope.
         * @method find
         * @param {string} selector - jQuery selector.
         * @returns {object} jQuery object.
         */
        this.find = function(selector) {
            return this.scope.find(selector);
        };

        /* test-code */
        this._testonly = {
            _moduleClassStorage: _moduleClassStorage,
            _eventStore: _eventStore,
            _moduleObjectStorage: _moduleObjectStorage
        };
        /* end-test-code */
    }

    var $$module$$default = $$module$$Module;
    function $$detect$$Detect() {
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

            _detect.canvastext = !!(_detect.canvas && $.isFunction(_doc.createElement('canvas').getContext('2d').fillText));
            _detect.draganddrop = (function() {
                var div = _doc.createElement('div');
                return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
            })();

            _detect.hashchange = !!('onhashchange' in _win && (typeof _doc.documentMode === 'undefined' || _doc.documentMode > 7));
            _detect.history = !!(_win.history && history.pushState);
            _detect.postmessage = !!_win.postMessage;
            _detect.websockets = !!('WebSocket' in _win || 'MozWebSocket' in _win);
            _detect.websqldatabase = !!_win.openDatabase;
            _detect.webworkers = !!_win.Worker;
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

            _detect.indexeddb = (function() {
                var props = ['indexeddb', 'WebkitIndexeddb', 'MozIndexeddb', 'OIndexeddb', 'msIndexeddb'];

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

            _detect.localstorage = (function() {
                try {
                    localStorage.setItem(_detect.mode, _detect.mode);
                    localStorage.removeItem(_detect.mode);
                    return true;
                } catch (error) {
                    return false;
                }
            })();

            _detect.sessionstorage = (function() {
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
            } else if (_detect.browser.webkit) {
                _detect.browser.safari = true;
            }
        }

        /**
         * Detect Operating System
         * @function detectOS
         */
        function detectOS() {
            _detect.OS.iOS = /(ipad|iphone|ipod)/g.test(_ua);
            _detect.OS.macOS = _ua.indexOf('mac') > -1;
            _detect.OS.windows = _ua.indexOf('win') > -1;
            _detect.OS.android = _ua.indexOf('android') > -1;
        }

        this.init = function() {
            html5Support();
            detectBrowser();
            detectOS();
        };
    }

    var $$detect$$default = $$detect$$Detect;

    var packages$loader$$Moff = this.Moff = new $$core$$default();
    packages$loader$$Moff.extend('module', $$module$$default, true);
    packages$loader$$Moff.extend('detect', $$detect$$default, true);
}).call(this);