/* globals jQuery */
import 'fitvids.1.1.0'
import 'flexslider'

import responsiveNav from './responsive-nav.jquery.js'
import accordion from './jquery.accordion.js'

(($) => {

    $.fn.responsiveNav = responsiveNav
    $.fn.accordion = accordion

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

    // gallery flexslider
    $('.gallery-slideshow.flexslider').flexslider({
        controlNav: 'thumbnails'
    });

})(jQuery)
