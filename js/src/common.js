/* globals jQuery */
import 'fitvids.1.1.0'

import responsiveNav from './responsive-nav.js'

(($) => {

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

})(jQuery)
