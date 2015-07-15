$(function() {

	var _mainImage;

	function setMainImage() {
		_mainImage = $('.vehicle_images_main img');
	}

	function initializeSlickJs() {
		$('.vehicle_images_thumbs-list').slick({
			infinite: true,
			slidesToShow: 5,
			slidesToScroll: 1
		})
	}

	function handleMainImage() {
		$(document).on('click', '.vehicle_images_thumbs-item img', changePreview);
	}

	function changePreview() {
		var index = this.src.match(/thumb(\d+)/);
		_mainImage.attr('src', 'images/preview' + index[1] + '.jpg');
	}

	setMainImage();
	initializeSlickJs();
	handleMainImage();
});
