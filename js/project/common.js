(function($) {

	//main hero slideshow
	$('.hero.flexslider').flexslider();

	// Make nav menu nice & responsive
	$('nav.main-nav').responsiveNav({
		navType: 'offCanvas' //default option for dropdown type use 'dropdown'
	});

	//wrap select elements in div for custom styling
	$('select').wrap('<div class="selectbox-container"></div>');

	//make sure embedded videos fit the container (are responsive)
	$('.rtecontent').fitVids();

	// ACCORDION
	$('dl.accordion').accordion();

	//flexslider for default wordpress gallery
	$('.gallery-slideshow.flexslider').flexslider({
		controlNav: 'thumbnails'
	});


})(jQuery);
