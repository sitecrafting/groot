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
        menuButton = document.querySelector(options.menuButtonSelector);
        
    // target dropdown element (element that slides open), which may be distinct from thisNav
    let dropdownElem = options.dropdownSelector ? document.querySelector(options.dropdownSelector) : thisNav;

    function _menuIsOpen() {
        //if the menubutton is marked as expanded the menu is open
        return menuButton.getAttribute('aria-expanded') == 'true' ? true : false;
    }


    /*
    * CLOSE NAVIGATION SETUP
    */
    function _closeDropdownNav(elem) {
        // Give the element a height to change from
        elem.style.height = elem.scrollHeight + 'px';
        elem.style.overflow = 'hidden';

        // Set the height back to 0
        window.setTimeout(function () {
            elem.style.height = '0';
        }, 1);

        // When the transition is complete, hide it
        window.setTimeout(function () {
            elem.setAttribute('data-visible', false);
            elem.style.height = '';
            elem.style.overflow = '';
        }, 350);

    }

    function _closeOffCanvasNav() {
        thisNav.setAttribute('data-visible', false);
    }

    const closeNavStrategies = {
        dropdown: _closeDropdownNav,
        offCanvas: _closeOffCanvasNav,
    }

    //set what type of closeNav we want
    const closeNavStrategy = closeNavStrategies[options.navType] || _closeOffCanvasNav;

    //THIS IS THE ACTUAL FUNCTION THAT GETS CALLED TO CLOSE THE NAV
    function closeNav() {
        closeNavStrategy(dropdownElem);
        wrapper.classList.remove( options.menuOpenWrapperClass );
        menuButton.setAttribute('aria-expanded', false);
    }

    /*
    * OPEN NAVIGATION SETUP
    */
    function _openDropdownNav(elem) {
        
        // Get the natural height of the element
        // Even though we’re showing and then re-hiding our content, it never shows visibly for users because 
        // the function runs so quickly (just a few milliseconds) and thus never actually renders visually in the DOM.
        elem.style.display = 'block'; // Make it visible
        var height = elem.scrollHeight + 'px'; // Get it's height
        elem.style.display = ''; //  Hide it again
        elem.setAttribute('data-visible', true);
        elem.style.height = height; // Update the max-height
        elem.style.overflow = 'hidden';

        // Once the transition is complete, remove the inline max-height so the content can scale responsively
        window.setTimeout(function () {
            elem.style.height = '';
            elem.style.overflow = '';
        }, 350);
    }

    function _openOffCanvasNav() {
        thisNav.setAttribute('data-visible', true);
    }

    const openNavStrategies = {
        dropdown: _openDropdownNav,
        offCanvas: _openOffCanvasNav,
    }
    //set what type of closeNav we want
    const openNavStrategy = openNavStrategies[options.navType] || _openOffCanvasNav

    //THIS IS THE ACTUAL FUNCTION THAT GETS CALLED TO OPEN THE NAV
    function openNav() {

        openNavStrategy(dropdownElem);
        wrapper.classList.add( options.menuOpenWrapperClass );
        menuButton.setAttribute('aria-expanded', true);

        if (options.closeOnOutsideClick) {
            // close the menu when the user clicks anywhere outside it
            wrapper.addEventListener('click', function (event) {
                if( !thisNav.contains(event.target) ){
                    closeNav();
                }
            });
        }
    }

    //Toggle Menu
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


    //function used for mobile only
    function handleSubnavExpander(event){
        event.stopPropagation();
        event.preventDefault();

        const expanderBtn = event.currentTarget;
        const subNav = expanderBtn.parentElement.nextElementSibling; //traverse up to the top level <a> tag then get the subnav ul which is a sibling
        const parentLi = expanderBtn.parentElement.parentElement;
        
        //if its not visible - open this subnav
        if( subNav.getAttribute('data-visible') == 'false' ){
            //expand the current

            _openDropdownNav(subNav);
            //subNav.setAttribute('data-visible', true); this is already done in the _openDropdownNav function
            expanderBtn.setAttribute('aria-expanded', true);

        } else {
            //close the subnav
            _closeDropdownNav(subNav);
            //subNav.setAttribute('data-visible', false);
            expanderBtn.setAttribute('aria-expanded', false);
        }

    }

    // Function to close all subnavs
    function closeAllSubnavs() {
        const allSubnavs = thisNav.querySelectorAll('[data-visible="true"]');
        allSubnavs.forEach(openSubNav => {
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
        }
    }
    // Function to handle clicking outside the navigation area
    function handleOutsideClick(event) {
        if (!thisNav.contains(event.target)) {
            closeAllSubnavs();
        }
    }
    function handleSubnavExpanderDesktop(event){
        
        if( event.key !== 'Enter' && event.key !== ' ') {
            return;
        }

        event.stopPropagation();
        event.preventDefault();

        const expanderBtn = event.currentTarget;
        const subNav = expanderBtn.parentElement.nextElementSibling;

        //if its not visible - open this subnav
        if( subNav.getAttribute('data-visible') == 'false' ){
            //expand the current

            //Close all other subnav and expanders
            closeAllSubnavs();

            document.addEventListener('keydown', handleEscapeKey);
            document.addEventListener('click', handleOutsideClick);

            //open this subnav
            subNav.setAttribute('data-visible', true);
            expanderBtn.setAttribute('aria-expanded', true);

        } else {
            //close the subnav
            subNav.setAttribute('data-visible', false);
            expanderBtn.setAttribute('aria-expanded', false);

            document.removeEventListener('keydown', handleEscapeKey);
            document.removeEventListener('click', handleOutsideClick);
        }
    }

    // Helper to open subnavs for current-menu-ancestor items on mobile
    function openCurrentAncestors() {
        const ancestorItems = thisNav.querySelectorAll('li.current-menu-ancestor, li.current-menu-item');
        ancestorItems.forEach(li => {
            const expanderBtn = li.querySelector('.nav-expander');
            const subNav = expanderBtn ? expanderBtn.parentElement.nextElementSibling : null;
            if (expanderBtn && subNav && subNav.getAttribute('data-visible') === 'false') {
                _openDropdownNav(subNav);
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
            // Media query matches Screen Size is desktop menu
            
            subnavExpanders.forEach(expander => {
                /*
                For each expander add the keydown listenter for desktop expanding
                remove the click listener
                */
                expander.addEventListener('keydown', handleSubnavExpanderDesktop);
                expander.removeEventListener('click', handleSubnavExpander);
            });

        } else {
            // Media query does not match so its the mobile menu
            subnavExpanders.forEach(expander => {
                /*
                for each expander remove the keydown listener for desktop
                add the click listener for mobile
                */
                expander.removeEventListener('keydown', handleSubnavExpanderDesktop);
                expander.addEventListener('click', handleSubnavExpander);
            });
        }
    }

    // Initial check for the media query
    handleMediaQueryChange(mediaQuery);
    // Listen for changes to the media query
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return this;
}
