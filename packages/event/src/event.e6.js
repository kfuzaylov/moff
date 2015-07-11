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
	 * Trigger event by name.
	 * @method trigger
	 * @param {string} name - Event name
	 */
	this.trigger = function(name) {
		var args = Array.prototype.slice.call(arguments, 1);

		if (typeof _eventStore[name] !== 'undefined') {
			Moff.runCallbacks(_eventStore[name], this, args);
		}
	};

	/**
	 * Get event from store.
	 * @param {string} name - Event name
	 * @returns {Array|undefined}
	 */
	this.get = function(name) {
		return _eventStore[name];
	};

	/* Test-code */
	this._testonly = {
		_eventStore: _eventStore
	};
	/* End-test-code */
}

export default Event;
