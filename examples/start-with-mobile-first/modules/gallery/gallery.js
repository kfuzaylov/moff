Moff.modules.create('Gallery', function() {
	var _module = this;

	var _activeSlideIndex = 0;

	var _slides;

	this.scopeSelector = '.achieve';

	function handleEvents() {
		_module.find('.achieve_button.__prev')[0].addEventListener('click', showPrev, false);
		_module.find('.achieve_button.__next')[0].addEventListener('click', showNext, false);
	}

	function getSlides() {
		_slides = _module.find('.achieve_container_slide');
	}

	function inactiveAll() {
		Moff.each(_slides, function() {
			var className = this.className.replace(/(^| )__active( |$)/, ' ');

			this.className = className.trim();
		});
	}

	function activate() {
		var slide = _slides[_activeSlideIndex];
		var className = slide.className + ' __active';

		slide.className = className;
	}

	function showSlide() {
		var image = _slides[_activeSlideIndex].querySelector('img');
		var dataSrc = image.getAttribute('data-src');

		if (dataSrc) {
			image.src = dataSrc;
			image.removeAttribute('data-src');
		}
	}

	function showPrev() {
		if (_activeSlideIndex) {
			_activeSlideIndex--;

			inactiveAll();
			activate();
			showSlide();
		}
	}

	function showNext() {
		if (_activeSlideIndex < _slides.length - 1) {
			_activeSlideIndex++;

			inactiveAll();
			activate();
			showSlide();
		}
	}

	this.init = function() {
		handleEvents();
		getSlides();
	}
});