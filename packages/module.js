/**
 * Register and control new Moff modules.
 * @module Module.
 */
function Module() {
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

export default Module;
