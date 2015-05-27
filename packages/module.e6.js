/**
 * Register and control new Moff modules.
 * @module Module.
 */
function Module() {
	/**
	 * @private {Module} _module - Link to object.
	 */
	var _module = this;

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
			_module.each(events, function(index, event) {
				_module.event.add(event);
			});
		}
	}

	/**
	 * @property {null|string} scopeSelector - Module scope selector. jQuery selector.
	 */
	this.scopeSelector = null;

	/**
	 * @property {null|object} scope - Module scope object. jQuery object.
	 */
	this.scope = null;

	/**
	 * @property {Array} events - Array of module events.
	 */
	this.events = [];

	/**
	 * @property {Function} beforeInit - Before initialization callback
	 */
	this.beforeInit = function() {};

	/**
	 * @property {Function} init - Initialization callback
	 */
	this.init = function() {};

	/**
	 * @property {Function} afterInit - After initialization callback
	 */
	this.afterInit = function() {};

	/**
	 * Register new module.
	 * @method register
	 * @param {string} name - module name
	 * @param {object} [depends] - object of js and css files
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

		if (!moduleObject) {
			window.console.warn(ClassName + ' Class is not registered');
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
				_module.each(params, function(key, value) {
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
				this.loadAssets(moduleObject.depends, initialize);
			} else {
				initialize();
			}
		} catch (error) {
			window.console.error(error);
		}
	};

	/**
	 * Get registered module by name.
	 * @method get
	 * @param {string} name - module name
	 * @return {object|Array|undefined} module object or undefined
	 */
	this.get = function(name) {
		return (_moduleObjectStorage.hasOwnProperty(name) && _moduleObjectStorage[name]) || undefined;
	};

	/**
	 * Returns all modules.
	 * @method getAll
	 * @returns {{}}
	 */
	this.getAll = function() {
		return _moduleObjectStorage;
	};

	/**
	 * Remove registered module by name.
	 * @method remove
	 */
	this.remove = function() {
		var name = this.moduleName;
		var id = this.id;
		var i = 0;
		var object, length;

		function removeObject() {
			_moduleObjectStorage[name].splice(i, 1);
			length = _moduleObjectStorage[name].length;
			--i;
		}

		// Be sure to remove existing module
		if (Array.isArray(_moduleObjectStorage[name])) {
			length = _moduleObjectStorage[name].length;

			for (; i < length; i++) {
				object = _moduleObjectStorage[name][i];

				if (object.id) {
					if (object.id === id) {
						removeObject();
					}
				} else if (object.moduleName === name) {
					removeObject();
				}
			}

			if (_moduleObjectStorage[name].length === 1) {
				_moduleObjectStorage[name] = _moduleObjectStorage[name][0];
			} else if (!_moduleObjectStorage[name].length) {
				delete _moduleObjectStorage[name];
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
			this.scope = document.querySelector(this.scopeSelector);
		}
	};

	/**
	 * Find element in module scope.
	 * @method find
	 * @param {string} selector - jQuery selector.
	 * @returns {object} jQuery object.
	 */
	this.find = function(selector) {
		return this.scope.querySelectorAll(selector);
	};

	/* Test-code */
	this._testonly = {
		_moduleClassStorage: _moduleClassStorage,
		_moduleObjectStorage: _moduleObjectStorage
	};
	/* End-test-code */
}

export default Module;
