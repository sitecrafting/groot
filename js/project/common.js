(function($) {
$(document).ready(function() {

	$('.gallery.flexslider').flexslider({
		controlNav: 'thumbnails'
	});

	// selectric for single-selection dropdown menus
	$('select').each( function() {
		if ( ! $(this).attr('multiple')) {
			$(this).selectric({
				disableOnMobile: false,
				responsive: true,
				maxHeight: 200
			});
		}
	});

	$("select#select-main").on('selectric-change', function() {
		//if category is not a blank value
		if ( $(this).val() !== '' ) {

			//make subcategory select active
			$('select#select-sub').removeAttr('disabled').selectric('refresh');

			//if we changed category, sub category has to be reselected and date disabled until sub category selected
			if ( !$('select#select-date').is(':disabled') ) {
				$('select#select-date').attr('disabled','disabled').selectric('refresh');
			}
		}
	});

	$("select#select-sub").on('selectric-change', function() {
		//if subcategory is not blank
		if ( $(this).val() !== '' ) {
			$('select#select-date').removeAttr('disabled').selectric('refresh');
		}
	});

	// Implement placeholders in browsers that "aren't trying hard enough yet"
	$('input, textarea').placeholder();

	// Make nav menu nice & responsive
	$('nav.main-nav').responsiveNav();

});
})(jQuery);