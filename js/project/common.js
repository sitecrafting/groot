(function($) {

	//wrap select elements in div for custom styling
	$('select').wrap('<div class="selectbox-container"');

	//make sure embedded videos fit the container (are responsive)
	$('.rtecontent').fitVids();

	//flexslider for default wordpress gallery
	$('.gallery.flexslider').flexslider({
		controlNav: 'thumbnails'
	});

	// Make nav menu nice & responsive
	$('nav.main-nav').responsiveNav();


})(jQuery);
