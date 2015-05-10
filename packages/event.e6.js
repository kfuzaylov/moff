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
	 * @method trigger
	 * @param {string} name - Event name
	 */
	this.trigger = function(name) {
		var args = Array.prototype.slice.call(arguments, 1);

		if (typeof _eventStore[name] !== 'undefined') {
			this.runCallbacks(_eventStore[name], this, args);
		}
	};

	/* Test-code */
	this._testonly = {
		_eventStore: _eventStore
	};
	/* End-test-code */
}

export default Event;
