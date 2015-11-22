$('.image-thumbs').slick({
	infinite: true,
	slidesToShow: 3,
	slidesToScroll: 3,
	prevArrow: '<button type="button" class="btn btn-default glyphicon glyphicon-chevron-left"></button>',
	nextArrow: '<button type="button" class="btn btn-default glyphicon glyphicon-chevron-right"></button>'
});

$('.image-thumbs img').on('click', function() {
	var number = $(this).attr('src').match(/thumb(\d)\.jpg/)[1];
	$('.carousel-preview img').attr('src', 'images/preview' + number + '.jpg');
});