(function($) {
$(document).ready(function() {

	$('.gallery.flexslider').flexslider({
		controlNav: 'thumbnails'
	});

	
	// Make nav menu nice & responsive
	$('nav.main-nav').responsiveNav();

});
})(jQuery);