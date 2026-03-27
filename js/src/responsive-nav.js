/**
ResponsiveNav module

Usage:

const mainNav = document.querySelector('nav.main-nav');
if( mainNav ){
    responsiveNav(mainNav,{
        navType: 'offCanvas',
        closeOnOutsideClick: true
    });
}

 */
import { openDropdown, closeDropdown } from './dropdown-animation-plugin.js'

export default function responsiveNav( thisNav, overwrites ) {

    const defaultOptions = {
        desktopEms: '81.25em', // 1240px
        wrapperSelector: '.site-wrapper',
        menuOpenWrapperClass: 'menu-open',
        menuButtonSelector: '.menu-btn',
        navType: 'offCanvas',
        dropdownSelector: '',
        closeOnOutsideClick: false,
    };
    let options = Object.assign({}, defaultOptions, overwrites);

    // Define the media query for when we are on the desktop menu - used to control events on the subnav expander
    const mediaQuery = window.matchMedia(`only screen and (min-width: ${options.desktopEms})`);

    let wrapper = document.querySelector(options.wrapperSelector ),
        menuButton = document.querySelector(options.menuButtonSelector),
        dropdownElem = options.dropdownSelector ? document.querySelector(options.dropdownSelector) : thisNav;

    function _menuIsOpen() {
        //if the menubutton is marked as expanded the menu is open
        return menuButton.getAttribute('aria-expanded') == 'true' ? true : false;
    }

    function _openOffCanvasNav() {
        thisNav.setAttribute('data-visible', true);
    }
    function _closeOffCanvasNav() {
        thisNav.setAttribute('data-visible', false);
    }

    const closeNavStrategies = {
        dropdown: closeDropdown, //imported function
        offCanvas: _closeOffCanvasNav,
    }
    const openNavStrategies = {
        dropdown: openDropdown, //imported function
        offCanvas: _openOffCanvasNav,
    }

    // Set what kind of open/close nav we want based on the navType option. 
    // If the navType doesn't match one of the keys in the openNavStrategies or closeNavStrategies objects, it will default to the offCanvas strategy.
    const closeNavStrategy = closeNavStrategies[options.navType] || _closeOffCanvasNav;
    const openNavStrategy = openNavStrategies[options.navType] || _openOffCanvasNav;

    // Tracks the last desktop expander used to open a subnav so Escape can restore focus
    let _activeSubnavExpander = null;

    // Named handler allows proper add/remove without accumulating anonymous listeners
    function _handleNavOutsideClick(event) {
        if( !thisNav.contains(event.target) ){
            closeNav();
        }
    }

    // Mobile-only Escape behavior: close the whole mobile nav
    function _handleMobileEscape(event) {
        if (event.key === 'Escape') {
            closeAllSubnavs();
            closeNav();
            menuButton.focus();
        }
    }

    // Functions to open and close the nav
    // these will call the appropriate strategy based on the navType option
    function openNav() {
        openNavStrategy(dropdownElem);
        wrapper.classList.add( options.menuOpenWrapperClass );
        menuButton.setAttribute('aria-expanded', true);

        if (options.closeOnOutsideClick) {
            // close the menu when the user clicks anywhere outside it
            wrapper.addEventListener('click', _handleNavOutsideClick);
        }

        if (!mediaQuery.matches) {
            document.addEventListener('keydown', _handleMobileEscape);
        }
    }
    function closeNav() {
        closeNavStrategy(dropdownElem);
        wrapper.classList.remove( options.menuOpenWrapperClass );
        menuButton.setAttribute('aria-expanded', false);
        wrapper.removeEventListener('click', _handleNavOutsideClick);
        document.removeEventListener('keydown', _handleMobileEscape);
    }
    

    //Navigation action listener
    menuButton.addEventListener('click', function(event) {
        event.stopPropagation();
        event.preventDefault();

        if ( _menuIsOpen() ) {
            closeNav();
        }
        else{
            openNav();
        }
    }); //end button on


    // Close only same-level sibling subnavs, preserving open ancestor paths for nested mobile menus
    function _closeSiblingSubnavs(expanderBtn) {
        const parentLi = expanderBtn.parentElement ? expanderBtn.parentElement.parentElement : null;
        const parentUl = parentLi ? parentLi.parentElement : null;
        if (!parentUl) {
            return;
        }

        parentUl.querySelectorAll(':scope > li > [data-visible="true"]').forEach(openSubNav => {
            const siblingExpander = openSubNav.previousElementSibling
                ? openSubNav.previousElementSibling.querySelector('.nav-expander')
                : null;

            openSubNav.setAttribute('data-visible', false);
            if (siblingExpander) {
                siblingExpander.setAttribute('aria-expanded', false);
            }
        });
    }

    function handleSubnavExpander(event){
        // Keydown: only respond to Enter and Space
        if( event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ' ) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();

        const expanderBtn = event.currentTarget;
        const subNav = expanderBtn.parentElement.nextElementSibling; //traverse up to the top level <a> tag then get the subnav ul which is a sibling

        if( subNav.getAttribute('data-visible') == 'false' ){
            if (mediaQuery.matches) {
                // Desktop: close all open subnavs first
                closeAllSubnavs();
            } else {
                // Mobile: keep ancestor menus open, only close same-level siblings
                _closeSiblingSubnavs(expanderBtn);
            }

            //open this subnav
            subNav.setAttribute('data-visible', true);
            expanderBtn.setAttribute('aria-expanded', true);
            _activeSubnavExpander = expanderBtn;

            if (mediaQuery.matches) {
                document.addEventListener('keydown', handleEscapeKey);
                document.addEventListener('click', handleOutsideClick);
            }
        } else {
            //close this subnav
            subNav.setAttribute('data-visible', false);
            expanderBtn.setAttribute('aria-expanded', false);
            _activeSubnavExpander = null;

            if (mediaQuery.matches) {
                document.removeEventListener('keydown', handleEscapeKey);
                document.removeEventListener('click', handleOutsideClick);
            }
        }
    }

    // Function to close all subnavs
    function closeAllSubnavs() {
        const allOpenSubnavs = thisNav.querySelectorAll('[data-visible="true"]');
        allOpenSubnavs.forEach(openSubNav => {
            openSubNav.setAttribute('data-visible', false);
            const siblingExpander = openSubNav.previousElementSibling.querySelector('.nav-expander');
            if (siblingExpander) {
                siblingExpander.setAttribute('aria-expanded', false);
            }
        });

        // Remove event listeners after closing all subnavs
        document.removeEventListener('keydown', handleEscapeKey);
        document.removeEventListener('click', handleOutsideClick);
    }
    // Function to handle the escape key press
    function handleEscapeKey(event) {
        if (event.key === 'Escape') {
            closeAllSubnavs();
            if (_activeSubnavExpander) {
                _activeSubnavExpander.focus();
                _activeSubnavExpander = null;
            }
        }
    }
    // Function to handle clicking outside the navigation area
    function handleOutsideClick(event) {
        if (!thisNav.contains(event.target)) {
            closeAllSubnavs();
        }
    }
    // Helper to open subnavs for current-menu-ancestor items on mobile
    function openCurrentAncestors() {
        const ancestorItems = thisNav.querySelectorAll('li.current-menu-ancestor, li.current-menu-item');
        ancestorItems.forEach(li => {
            const expanderBtn = li.querySelector('.nav-expander');
            const subNav = expanderBtn ? expanderBtn.parentElement.nextElementSibling : null;
            // Only open if there's a subnav and it's currently closed
            if (expanderBtn && subNav && subNav.getAttribute('data-visible') === 'false') {
                subNav.setAttribute('data-visible', true);
                expanderBtn.setAttribute('aria-expanded', true);
            }
        });
    }

    // On resize, check menu type and act accordingly
    function handleResize() {
        if (mediaQuery.matches) {
            // Desktop: close all subnavs
            closeAllSubnavs();
        } else {
            // Mobile: open current-menu-ancestor subnavs
            openCurrentAncestors();
        }
    }

    // Listen for window resize
    window.addEventListener('resize', handleResize);

    // Initial check
    handleResize();

    //button that controls subnav
    const subnavExpanders = thisNav.querySelectorAll('.nav-expander');

    // Function to handle the behavior based on the media query
    function handleMediaQueryChange(e) {
        if (e.matches) {
            // Desktop: keydown only
            subnavExpanders.forEach(expander => {
                expander.addEventListener('keydown', handleSubnavExpander);
                expander.removeEventListener('click', handleSubnavExpander);
            });

            document.removeEventListener('keydown', _handleMobileEscape);
        } else {
            // Mobile: click + keydown
            subnavExpanders.forEach(expander => {
                expander.addEventListener('click', handleSubnavExpander);
                expander.addEventListener('keydown', handleSubnavExpander);
            });
        }
    }

    // Initial check for the media query
    handleMediaQueryChange(mediaQuery);

    // Listen for changes to the media query
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return this;
}
