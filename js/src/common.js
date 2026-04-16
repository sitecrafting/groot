/* globals jQuery */
import 'fitvids.1.1.0'

//uncomment this if dropdown animation is needed
//import { openDropdown, closeDropdown } from './dropdown-animation-plugin.js'
import responsiveNav from './responsive-nav.js'

(($) => {


    // Make nav menu nice & responsive
    const mainNav = document.querySelector('nav.main-nav');
    if( mainNav ){
        responsiveNav(mainNav,{
            desktopEms: '81.25em', // size of screen for desktop menu, should match less media query for @desktop-menu
            wrapperSelector: '.site-wrapper',
            navType: 'offCanvas',
            offCanvasInertSelectors: ['main', '.site-footer', '.logo'],
            closeOnOutsideClick: true
        });
    }

    //Make subnav menu responsive
    const subNav = document.querySelector('nav.subnav');
    if(subNav){
        responsiveNav(subNav,{
            desktopEms: '48em', // size of screen for desktop menu, should match less media query for @desktop-subnav
            wrapperSelector: '.subnav-wrapper',
            navType: 'dropdown',
            menuButtonSelector: '.subnav-mobile-toggle'
        });
    }

    // Responsive Videos
    $('.rtecontent, .video').fitVids();

})(jQuery)
