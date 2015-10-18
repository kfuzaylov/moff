describe('Event system', function() {
	var trigger;
	var handler = function() {
		expect(arguments.length).toEqual(2);
		trigger = true;
	};

	it('can register new event', function() {
		Moff.event.add('newEvent');
		expect(Array.isArray(Moff.event._testonly._eventStore['newEvent'])).toBe(true);
	});

	it('can assign for event only callbacks', function() {
		Moff.event.on('newEvent', handler);

		expect(typeof Moff.event._testonly._eventStore['newEvent'][0]).toEqual('function');
		Moff.event.on('newEvent', {});
		expect(Moff.event._testonly._eventStore['newEvent'].length).toEqual(1);
	});

	it('can trigger callbacks and pass all arguments', function() {
		Moff.event.trigger('newEvent', 'text1', 'text2');
		expect(trigger).toBe(true);
	});

	it('can get event from store', function() {
		expect(Array.isArray(Moff.event.get('newEvent'))).toBe(true);
		expect(Moff.event.get('nonexistentEvent')).toBeUndefined();
	});

	it('can remove event handler', function() {
		Moff.event.off('newEvent', handler);
		expect(Moff.event.get('newEvent')).toBeUndefined();
	});

	it('can remove all handlers', function() {
		Moff.event.add('newEvent');
		Moff.event.on('newEvent', function(){});
		Moff.event.on('newEvent', function(){});
		expect(Moff.event._testonly._eventStore['newEvent'].length).toEqual(2);

		Moff.event.off('newEvent');
		expect(Moff.event.get('newEvent')).toBeUndefined();
	});

	it('can add one time execute handlers', function() {
		Moff.event.add('oneTime');
		Moff.event.once('oneTime', function() {});
		Moff.event.trigger('oneTime');
		expect(Moff.event.get('oneTime')).toBeUndefined();
	});
});