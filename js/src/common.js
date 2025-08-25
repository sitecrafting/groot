/* globals jQuery */
import 'fitvids.1.1.0'

import './slideshows.js'
import responsiveNav from './responsive-nav.js'
import accordion from './jquery.accordion.js'

(($) => {

    //$.fn.responsiveNav = responsiveNav
    $.fn.accordion = accordion

    const html = document.querySelector('html');
    html.classList.remove('no-js')
    html.classList.add('js');

    // Make nav menu nice & responsive
    const mainNav = document.querySelector('nav.main-nav');
    if( mainNav ){
        responsiveNav(mainNav,{
            desktopEms: '81.25em', // size of screen for desktop menu, should match less media query for @desktop-menu
            wrapperSelector: '.main-nav',
            navType: 'offCanvas',
            closeOnOutsideClick: true
        });
    }

    //Make subnav menu responsive
    const subNav = document.querySelector('nav.subnav');
    if(subNav){
        responsiveNav(subNav,{
            wrapperSelector: '.subnav-wrapper',
            navType: 'dropdown',
            menuButtonSelector: '.subnav-mobile-toggle'
        });
    }

    // Responsive Videos
    $('.rtecontent, .video').fitVids();

    // Accordions
    $('dl.accordion').accordion();

    //filter on change
    $('#categoryFilter').on('change',function(){
		var catLink = $(this).val();
		window.location = catLink;
	});



})(jQuery)
