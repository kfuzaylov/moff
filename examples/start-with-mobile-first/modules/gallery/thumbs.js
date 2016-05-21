Moff.modules.create('Thumbs', function() {
	var _module = this;
	this.gallery = Moff.modules.get('Gallery');
	
	this.scopeSelector = '.achieve';
	
	this.initCarousel = function() {
		var slidesToShow = 2;

		if (/md|lg/.test(Moff.getMode())) {
			slidesToShow = 5;
		}

		$(this.find('.image-thumbs')).slick({
			infinite: true,
			slidesToShow: slidesToShow,
			slidesToScroll: 1,
			prevArrow: '<button type="button" class="btn btn-default glyphicon glyphicon-chevron-left"></button>',
			nextArrow: '<button type="button" class="btn btn-default glyphicon glyphicon-chevron-right"></button>'
		});
	};
	
	this.hideButtons = function() {
		$(this.find('.achieve_button')).hide();
	};
	
	this.handleThumbs = function() {
		$(this.find('.image-thumbs img')).on('click', function() {
			var number = $(this).attr('src').match(/thumb(\d)\.jpg/)[1];
			var preview = $('[src="images/preview' + number + '.jpg"]');
			
			if (!preview.length) {
				preview = $('[data-src="images/preview' + number + '.jpg"]');
			}

			preview = preview.closest('.achieve_container_slide');

			var index = $(_module.find('.achieve_container_slide')).index(preview);

			_module.gallery.setIndex(index);
			_module.gallery.showSlide();
		});
	};
	
	this.init = function() {
		this.initCarousel();
		this.hideButtons();
		this.handleThumbs();
	};
});