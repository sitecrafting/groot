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

    // Search Dialog
    const searchDialog = document.getElementById('searchDialog');
    const btnOpenSearch = document.getElementById('btnOpenSearch');
    const btnCloseSearch = document.getElementById('btnCloseSearch');

    if (searchDialog && btnOpenSearch && btnCloseSearch) {
        btnOpenSearch.addEventListener('click', () => {
            searchDialog.showModal();
            btnOpenSearch.setAttribute('aria-expanded', 'true');
        });

        btnCloseSearch.addEventListener('click', () => {
            searchDialog.close();
            btnOpenSearch.setAttribute('aria-expanded', 'false');
        });
    }


})(jQuery)
