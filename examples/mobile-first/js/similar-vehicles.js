Moff.modules.create('SimilarVehicles', function() {
	var _module = this;

	function initQuickView() {
		Moff.each(_module.find('.popup'), function(index, popup) {
			$(popup).magnificPopup({
				type: 'ajax'
			});
		});
	}

	this.scopeSelector = '.vehicle_similar';

	this.init = function() {
		initQuickView();
	};
});
