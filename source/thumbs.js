$('.image-thumbs').slick({
	infinite: true,
	slidesToShow: 2,
	slidesToScroll: 2,
	prevArrow: '<button type="button" class="btn btn-default glyphicon glyphicon-chevron-left"></button>',
	nextArrow: '<button type="button" class="btn btn-default glyphicon glyphicon-chevron-right"></button>'
});

$('.achieve_button').hide();

$('.image-thumbs img').on('click', function() {
	var number = $(this).attr('src').match(/thumb(\d)\.jpg/)[1];
	var preview = $('[src="images/preview' + number + '.jpg"]');

	$('.achieve_container').removeClass('__active');
	preview.closest('.achieve_container').addClass('__active');
});