/* globals jQuery */
import 'fitvids.1.1.0'

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
    $('.rtecontent, .video').fitVids();

    // Accordions
    $('dl.accordion').accordion();

    $('#categoryFilter').on('change',function(){
		var catLink = $(this).val();
		window.location = catLink;
	});



})(jQuery)
