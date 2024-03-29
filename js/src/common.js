/* globals jQuery */
import 'fitvids.1.1.0'
import 'magnific-popup'

import './slideshows.js'
import responsiveNav from './responsive-nav.jquery.js'
import accordion from './jquery.accordion.js'

(($) => {

    $.fn.responsiveNav = responsiveNav
    $.fn.accordion = accordion

    const html = document.querySelector('html');
    html.classList.remove('no-js')
    html.classList.add('js');

    // Make nav menu nice & responsive
    $('nav.main-nav').responsiveNav({
        navType: 'offCanvas',
        closeOnOutsideClick: true
    });
	$('nav.subnav').responsiveNav({
		navType: 'dropdown',
		menuButtonSelector: '.subnav__mobile-toggle',
		dropdownSelector: '.subnav__menu'
	});

    // Responsive Videos
    $('.rtecontent').fitVids();

    // Accordions
    $('dl.accordion').accordion();

    $('#categoryFilter').on('change',function(){
		var catLink = $(this).val();
		window.location = catLink;
	});

	//SEARCH POPUP
    $('.js-open-search').magnificPopup({
		type:'inline',
		alignTop: true,
		modal: true,
		midClick: true, // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
		mainClass: 'mfp-fade',
		focus : '#s',
		callbacks: {
			  // When elemened is focused, some mobile browsers in some cases zoom in
				// It looks not nice, so we disable it:
			  beforeOpen: function() {
				  if($(window).width() < 700) {
					  this.st.focus = false;
				  } else {
					  this.st.focus = '#s';
				  }
			  }
		}
	  });
	  $(document).on('click', '.js-close-popup', function (e) {
		  e.preventDefault();
		  $.magnificPopup.close();
	  });
	  /* END SEARCH CONTROLS */

})(jQuery)
