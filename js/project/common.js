(function($) {

	//main hero slideshow
	$('.hero.flexslider').flexslider();

	// Make nav menu nice & responsive
	$('nav.main-nav').responsiveNav({
		navType: 'offCanvas' //default option for dropdown type use 'dropdown'
	});

	// Custom Select Boxes
	$('select').wrap('<div class="selectbox-container"></div>');

	// Responsive Videos
	$('.rtecontent').fitVids();

	// Accordions
	$('dl.accordion').accordion();

	// gallery flexslider
	$('.gallery-slideshow.flexslider').flexslider({
		controlNav: 'thumbnails'
	});

	$('nav.side-nav').mobileSidenav();

})(jQuery);
