/**
jQueryResponsiveNav module

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
        wrapperSelector: '.site-wrapper',
        menuOpenWrapperClass: 'menu-open',
        menuButtonSelector: '.menu-btn',
        navType: 'offCanvas',
        dropdownSelector: '',
        closeOnOutsideClick: false,
    };

    let options = Object.assign({}, defaultOptions, overwrites);

    let wrapper = document.querySelector(options.wrapperSelector ),
        menuButton = document.querySelector(options.menuButtonSelector);
        

    // target dropdown element (element that slides open), which may be distinct from thisNav
    let dropdownElem = options.dropdownSelector ? document.querySelector(options.dropdownSelector) : thisNav;

    function _menuIsOpen() {
        //if the menubutton is marked as expended the menu is open
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


    function handleSubnavExpander(event){
        event.stopPropagation();
        event.preventDefault();

        const expanderBtn = event.currentTarget;
        const subNav = expanderBtn.parentElement.nextElementSibling; //traverse up to the top level <a> tag then get the subnav ul which is a sibling
        const parentLi = expanderBtn.parentElement.parentElement;
        const siblingLis = parentLi.parentElement.children; //gets all the siblings LIs including the current parent LI
        
        //if its not visible - close other subnav - open this subnav
        if( subNav.getAttribute('data-visible') == 'false' ){
            //loop through and close siblings
            for (let i = 0; i < siblingLis.length; i++) {
                const siblingLi = siblingLis[i];
                //check if subnav ul exists and its not our currently click subnav li
                if( siblingLi !== parentLi && siblingLi.querySelector(':scope > ul') ){
                    //close the sibling subnav
                    //siblingLi.querySelector(':scope > ul').setAttribute('data-visible', false);
                    _closeDropdownNav(siblingLi.querySelector(':scope > ul'));
                    siblingLi.querySelector(':scope > a > .nav-expander').setAttribute('aria-expanded', false);
                }
            }

            //expand the current
            //subNav.setAttribute('data-visible', true);
            _openDropdownNav(subNav);
            expanderBtn.setAttribute('aria-expanded', true);

        } else {
            //close the subnav
            //subNav.setAttribute('data-visible', false);
            _closeDropdownNav(subNav);
            expanderBtn.setAttribute('aria-expanded', false);
        }

    }

    const subnavExpanders = thisNav.querySelectorAll('.nav-expander');
    subnavExpanders.forEach(expander => {
        expander.addEventListener('click', handleSubnavExpander);
    });


    return this;
}
