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
			Moff.each(events, function(index, event) {
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
	this.create = function(name, depend, Constructor) {
		// Normalize arguments
		if (typeof Constructor === 'undefined') {
			Constructor = depend;
			depend = undefined;
		}

		// Register new module in the storage
		Constructor.prototype = Moff.Module;
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
	this.initClass = function(ClassName, params) {
		var moduleObject = _moduleClassStorage[ClassName];

		if (!moduleObject) {
			Moff.debug(ClassName + ' Class is not registered');
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
				Moff.each(params, function(key, value) {
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
	 * Get modules by passed property.
	 * @method getBy
	 * @param {string} field - Module property name
	 * @param {*} value - Property value
	 * @returns {Array} Array of modules filtered by property
	 */
	this.getBy = function(field, value) {
		var all = this.getAll();
		var result = [];

		// Normalize field
		if (field === 'class') {
			field = 'moduleName';
		}

		Moff.each(all, (className, object) => {
			if (Array.isArray(object)) {
				Moff.each(object, (index, obj) => {
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
	this.remove = function(module) {
		var i = 0;
		var isInstance = typeof module !== 'string';
		var moduleName = isInstance ? module.moduleName : module;
		var storage = _moduleObjectStorage[moduleName];

		// Be sure to remove existing module
		if (Array.isArray(storage)) {
			let length = storage.length;

			for (; i < length; i++) {
				let object = storage[i];

				if ((isInstance && object === module) || (!isInstance && object.moduleName === moduleName)) {
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

	/* Test-code */
	this._testonly = {
		_moduleClassStorage: _moduleClassStorage,
		_moduleObjectStorage: _moduleObjectStorage
	};
	/* End-test-code */
}

export default ModulesApi;
