describe('Event system', function() {
	var trigger;

	it('can register new event', function() {
		Moff.event.add('newEvent');
		expect(Array.isArray(Moff.event._testonly._eventStore['newEvent'])).toBe(true);
	});

	it('can assign for event only callbacks', function() {
		Moff.event.on('newEvent', function() {
			expect(arguments.length).toEqual(2);
			trigger = true;
		});

		expect(typeof Moff.event._testonly._eventStore['newEvent'][0]).toEqual('function');
		Moff.event.on('newEvent', {});
		expect(Moff.event._testonly._eventStore['newEvent'].length).toEqual(1);
	});

	it('can trigger callbacks and pass all arguments', function() {
		Moff.event.trigger('newEvent', 'text1', 'text2');
		expect(trigger).toBe(true);
	});

	it('can get event from store', function() {
		expect(Array.isArray(Moff.event.get('newEvent'))).toBe(true)
		expect(Moff.event.get('nonexistentEvent')).toBeUndefined();
	});
});