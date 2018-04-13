(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

describe('Event system', function () {
	var trigger;
	var handler = function handler() {
		expect(arguments.length).toEqual(2);
		trigger = true;
	};

	it('can register new event', function () {
		Moff.event.add('newEvent');
		expect(Array.isArray(Moff.event._testonly._eventStore.newEvent)).toBe(true);
	});

	it('can assign for event only callbacks', function () {
		Moff.event.on('newEvent', handler);

		expect(_typeof(Moff.event._testonly._eventStore.newEvent[0])).toEqual('function');
		Moff.event.on('newEvent', {});
		expect(Moff.event._testonly._eventStore.newEvent.length).toEqual(1);
	});

	it('can trigger callbacks and pass all arguments', function () {
		Moff.event.trigger('newEvent', 'text1', 'text2');
		expect(trigger).toBe(true);
	});

	it('can get event from store', function () {
		expect(Array.isArray(Moff.event.get('newEvent'))).toBe(true);
		expect(Moff.event.get('nonexistentEvent')).toBeUndefined();
	});

	it('can remove event handler', function () {
		Moff.event.off('newEvent', handler);
		expect(Moff.event.get('newEvent')).toBeUndefined();
	});

	it('can remove all handlers', function () {
		Moff.event.add('newEvent');
		Moff.event.on('newEvent', function () {});
		Moff.event.on('newEvent', function () {});
		expect(Moff.event._testonly._eventStore.newEvent.length).toEqual(2);

		Moff.event.off('newEvent');
		expect(Moff.event.get('newEvent')).toBeUndefined();
	});

	it('can add one time execute handlers', function () {
		Moff.event.add('oneTime');
		Moff.event.once('oneTime', function () {});
		Moff.event.trigger('oneTime');
		expect(Moff.event.get('oneTime')).toBeUndefined();
	});
});

},{}]},{},[1]);
