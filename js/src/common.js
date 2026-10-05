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
            hasSearchInNav: mainNav.dataset.hasSearch === 'true',
            searchDialogSelector: '#searchDialog',
            offCanvasInertSelectors: ['main', '.site-footer', '.logo', '.skip-to-content-link'],
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

    // Search dialog controls are centralized here instead of inline onclick handlers.
    const searchDialog = document.getElementById('searchDialog');
    const btnOpenSearch = document.getElementById('btnOpenSearch');
    const btnCloseSearch = document.getElementById('btnCloseSearch');

    if (searchDialog && btnOpenSearch && btnCloseSearch) {
        btnOpenSearch.addEventListener('click', function() {
            searchDialog.showModal();
        });

        btnCloseSearch.addEventListener('click', function() {
            searchDialog.close();
            btnOpenSearch.focus();
        });

        searchDialog.addEventListener('close', function() {
            // Escape/backdrop-close should also restore focus to the opener.
            btnOpenSearch.focus();
        });
    }

    //NEWS LANDING FILTER LINK LIST
    const newsFilter = document.getElementById('categoryFilter');
    if( newsFilter ){
        const filterBtn = document.getElementById('category-nav-button');
        const list = document.getElementById('category-nav-list');

        const closeFilterMenu = ({ restoreFocus = false } = {}) => {
            filterBtn.setAttribute('aria-expanded', 'false');
            list.hidden = true;

            if( restoreFocus ){
                filterBtn.focus();
            }
        };

        // 1. Toggle Menu Visibility
        filterBtn.addEventListener('click', () => {
            const isExpanded = filterBtn.getAttribute('aria-expanded') === 'true';
            filterBtn.setAttribute('aria-expanded', !isExpanded);
            list.hidden = isExpanded;
        });

        // 2. Close menu if clicking outside
        document.addEventListener('click', (e) => {
            if (!filterBtn.contains(e.target) && !list.contains(e.target)) {
                closeFilterMenu();
            }
        });

        // 3. Close menu on escape and return focus to trigger button
        document.addEventListener('keydown', (e) => {
            if( e.key !== 'Escape' ) return;

            closeFilterMenu({ restoreFocus: true });
        });

        // 4. Close menu when keyboard focus tabs away from the filter
        newsFilter.addEventListener('focusout', (e) => {
            if( list.hidden ) return;

            const nextFocusedElement = e.relatedTarget;
            if( !nextFocusedElement || !newsFilter.contains(nextFocusedElement) ){
                closeFilterMenu();
            }
        });
    }


})(jQuery)
