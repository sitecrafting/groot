/* globals jQuery */
import 'fitvids.1.1.0'
import 'flexslider'
//import 'magnific-popup'
//import objectFitImages from 'object-fit-images';

import responsiveNav from './responsive-nav.jquery.js'
import accordion from './jquery.accordion.js'

(($) => {

    $.fn.responsiveNav = responsiveNav
    $.fn.accordion = accordion

    //polyfill for IE object-fit on images - https://github.com/fregante/object-fit-images
    //var $objectFit = $('img.object-fit');
    //objectFitImages($objectFit);

    //main hero slideshow
    $('.slideshow.flexslider').flexslider();

    // Make nav menu nice & responsive
    $('nav.main-nav').responsiveNav({
        navType: 'offCanvas', //default option for dropdown type use 'dropdown'
        closeOnOutsideClick: true, //set to false if using dropdown type
        showTabsOnFocus: true,
    });

    // Responsive Videos
    $('.rtecontent').fitVids();

    // Accordions
    $('dl.accordion').accordion();

	//testimonials flexslider
	$('.testimonials.flexslider').flexslider({
		directionNav : false
	});

    // gallery flexslider
    $('.gallery-slideshow.flexslider').flexslider({
        controlNav: 'thumbnails'
    });

})(jQuery)
