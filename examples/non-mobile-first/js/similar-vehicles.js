$(function() {
	$.each($('.popup'), function(index, popup) {
		$(popup).magnificPopup({
			type: 'ajax'
		});
	});
});
