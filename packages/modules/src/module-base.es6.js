/**
 * Module base class.
 * @class ModuleBase
 * @constructor
 */
function ModuleBase() {
	/**
	 * @property {null|string} scopeSelector - Module scope selector. CSS selector.
	 */
	this.scopeSelector = null;

	/**
	 * @property {null|object} scope - Module scope object. HTML element.
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
	 * @param {string} selector - CSS selector.
	 * @returns {object} HTML element.
	 */
	this.find = function(selector) {
		return this.scope.querySelectorAll(selector);
	};

	/**
	 * Extends constructor's prototype with additional properties and functions
	 * @method reopen
	 * @param {{}} additions - Additional methods and properties
	 */
	this.reopen = function(additions) {
		if (typeof additions !== 'object') {
			Moff.debug('Reopen method argument must be an object');
			return;
		}

		var obj = this;
		Moff.each(additions, function(property, value) {
			obj[property] = value;
		});
	}
}

export default ModuleBase;