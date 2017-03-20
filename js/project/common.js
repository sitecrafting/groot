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

	// Flexslider
	// override for default wordpress gallery
	$('.gallery-slideshow.flexslider').flexslider({
		controlNav: 'thumbnails'
	});

	// Adding resize debounced handling for
	// navigation and possible layout adjustments
	$(window).resize( $.debounce( 50, true, function(){
	})).resize( $.debounce( 50, false, function(){
		var $trigger = $('.mobile-trigger');

		// Adding Secondary mobile accordions for Course details
		// Check to make sure we're in Tablet view or below
		// Also make sure you have '.mobile-trigger' elements in your markup (outside of nav)
		if ($trigger.is(':visible')){
			// Multiple elements exist so lets apply this to each
			$trigger.each(function(){
				//unbind first to prevent build up on resizes
				$(this).unbind('touchstart, click').bind('touchstart, click', function() {
					// if 'mobile-collapsed' is hidden, expand it
					// else hide it again
					if ($(this).next().is(':visible')) {
						$(this).removeClass('panel-open');
						$(this).next().slideUp();
					} else {
						$(this).addClass('panel-open');
						$(this).next().slideDown();
					}
				});
			});
		} else {
			//remove jQuery applied inline styles to hide 'mobile-collapsed'
			$('nav.side-nav').removeAttr('style');
		}
	}));

	// Trigger resize on page load
	$(window).trigger('resize');
})(jQuery);
