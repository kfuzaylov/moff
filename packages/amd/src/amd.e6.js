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
		Moff.each(_deferredObjects, function(i, obj) {
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
		Moff.each(_registeredFiles, function(id, object) {
			// Don't load register if it is used in data-load-module attribute because it will be included after content of element be loaded.
			if (object.loadOnScreen.length && object.loadOnScreen.indexOf(Moff.getMode()) !== -1 && !_doc.querySelectorAll(`[data-load-module="${id}"]`).length) {
				_amd.include(id);
			}
		});
	}

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
	this.include = function(id, callback, options = {}) {
		var register = _registeredFiles[id];

		if (!register) {
			Moff.debug(`${id} AMD module is not registered.`);

			return;
		}

		// Normalize arguments
		if (typeof callback === 'object') {
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
			_deferredObjects.push({id, callback});

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

	Moff.$(function() {
		handleEvents();
		includeRegister();
	});

	/* Test-code */
	this._testonly = {
		_deferredObjects,
		_registeredFiles
	};
	/* End-test-code */

}

export default AMD;
