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
	 * Register module name and object
	 * @param {object} module - Module object
	 * @param {string} name - Module name
	 */
	function registerModule(module, name) {
		module.prototype = _module;
		module.prototype.constructor = module;

		// Save module in storage
		if (typeof _moduleClassStorage[name] === 'undefined') {
			_moduleClassStorage[name] = module;
		}
	}

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
	 * @param {array} depends - array of js files depends
	 * @param {function} module - constructor
	 */
	this.register = function(name, depends, module) {
		// Normalize arguments
		if (typeof module === 'undefined') {
			module = depends;
			depends = undefined;
		}

		// Register new module in the storage
		if (!_moduleObjectStorage.hasOwnProperty(name)) {
			if (depends) {
				this.loadDepends(depends, function() {
					registerModule(module, name);
				});
			} else {
				registerModule(module, name);
			}
		}
	};

	/**
	 * Initialize registered class
	 * @method initClass
	 * @param {string} ClassName - Name of registered class
	 * @param {object} [params] - Object with additional params
	 */
	this.initClass = function(ClassName, params) {
		try {
			// Create new class object
			var classObject = new _moduleClassStorage[ClassName]();
			var storedObject = _moduleObjectStorage[ClassName];

			// Store objects in array if there are more then one classes
			if ($.isArray(storedObject)) {
				_moduleObjectStorage[ClassName].push(classObject);
			} else if (typeof storedObject !== 'undefined') {
				_moduleObjectStorage[ClassName] = [storedObject, classObject];
			} else {
				_moduleObjectStorage[ClassName] = classObject;
			}

			if (params) {
				// Apply all passed data
				$.each(params, function(key, value) {
					classObject.set(key, value);
				});
			}

			// Add module name
			classObject.moduleName = ClassName;

			if (typeof classObject.beforeInit === 'function') {
				classObject.beforeInit();
			}

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

			return classObject;
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
		// Register if assigned event is not registered yet.
		// Need in case when some module assign to another module event before its registration.
		this.registerEvent(name);

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
	 * Set object any property.
	 * @method set
	 * @param {string} prop - Property name
	 * @param {mixed} value - Property value
	 */
	this.set = function(prop, value) {
		this[prop] = value;
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
		if (typeof this.scopeSelector !== 'undefined') {
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
}

export default Module;
