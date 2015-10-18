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
	this.add = function(name) {
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
	this.on = function(name, callback) {
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
	this.once = function(name, callback) {
		callback._onceExecuted = true;
		this.on(name, callback);
	};

	/**
	 * Trigger event by name.
	 * @method trigger
	 * @param {string} name - Event name
	 */
	this.trigger = function(name) {
		var event = this;
		var args = Array.prototype.slice.call(arguments, 1);
		var indexes = [];

		if (typeof _eventStore[name] !== 'undefined') {
			Moff.runCallbacks(_eventStore[name], this, args);

			Moff.each(_eventStore[name], function(index, handler) {
				if (handler._onceExecuted) {
					indexes.push(index);
				}
			});

			// Remove one time executed handlers
			Moff.each(indexes, function(index, number) {
				event.off(name, _eventStore[name][number]);
			});
		}
	};

	/**
	 * Get event from store.
	 * @param {string} name - Event name
	 * @returns {Array|undefined}
	 */
	this.get = function(name) {
		var event = _eventStore[name];

		if (Array.isArray(event) && event.length) {
			return event;
		} else {
			return undefined;
		}
	};

	/**
	 * Removes event handler
	 * @method off
	 * @param {string} name - Event name
	 * @param {function} handler - Event handler
	 */
	this.off = function(name, handler) {
		if (!handler) {
			_eventStore[name] = [];
			return;
		}

		Moff.each(_eventStore[name], function(index, callback) {
			if (callback === handler) {
				_eventStore[name].splice(index, 1);
				return false;
			}
		});
	};

	/* Test-code */
	this._testonly = {
		_eventStore: _eventStore
	};
	/* End-test-code */
}

export default Event;
