(function($) {
$(document).ready(function() {

	$('.rtecontent').fitVids();

	$('.gallery.flexslider').flexslider({
		controlNav: 'thumbnails'
	});

	// Make nav menu nice & responsive
	$('nav.main-nav').responsiveNav();

});
})(jQuery);
