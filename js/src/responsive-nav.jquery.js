/* globals jQuery */

import { debounce } from 'throttle-debounce'

/**
 * jQueryResponsiveNav module
 *
 * Usage:
 *
 * ```js
 * $.fn.responsiveNav = require('./responsive-nav.jquery.js')
 *
 * $('.my-nav-element').responsiveNav({
 *   navType: 'offCanvas'
 * })
 * ```
 */
export default (($) => {

return function jQueryResponsiveNav( options ) {

    options = $.extend({}, {
        wrapperSelector: '.site-wrapper',
        menuButtonSelector: '.menu-btn',
        menuOpenWrapperClass: 'menu-open',
        activeClass: 'active',
        dropdownSelector: '',
        navType: 'offCanvas',
        debounceTime: 150,
        closeOnOutsideClick: false,
        showTabsOnFocus: false,
    }, options)

    const $this = $(this),
        $wrapper = $( options.wrapperSelector ),
        $menuButton = $( options.menuButtonSelector )

    // target dropdown element, which may be distinct from $this
    const $dropdownElem = options.dropdownSelector ?
                            $(options.dropdownSelector) :
                            $this

    function _menuIsOpen() {
        //site wrapper has the menu-open class
        return $menuButton.hasClass( options.activeClass )
    }

    /*
    * CLOSE NAVIGATION SETUP
    */
    function _closeDropdownNav() {
        $dropdownElem.slideUp()
    }

    function _closeOffCanvasNav() {
        $wrapper.removeClass( options.menuOpenWrapperClass )
    }

    const closeNavStrategies = {
        dropdown: _closeDropdownNav,
        offCanvas: _closeOffCanvasNav,
    }

    //set what type of closeNav we want
    const closeNavStrategy = closeNavStrategies[options.navType] || _closeOffCanvasNav

    //THIS IS THE ACTUAL FUNCTIoN THAT GETS CALLED TO CLOSE THE NAV
    function closeNav() {
        closeNavStrategy()
        $menuButton.removeClass( options.activeClass )
    }

    /*
    * OPEN NAVIGATION SETUP
    */
    function _openDropdownNav() {
        $dropdownElem.slideDown()
    }

    function _openOffCanvasNav() {
        $wrapper.addClass( options.menuOpenWrapperClass )
    }

    const openNavStrategies = {
        dropdown: _openDropdownNav,
        offCanvas: _openOffCanvasNav,
    }
    //set what type of closeNav we want
    const openNavStrategy = openNavStrategies[options.navType] || _openOffCanvasNav

    //THIS IS THE ACTUAL FUNCTION THAT GETS CALLED TO OPEN THE NAV
    function openNav() {

        openNavStrategy();
        $menuButton.addClass( options.activeClass );

        if (options.closeOnOutsideClick) {
            // close the menu when the user clicks anywhere outside it
            $(options.wrapperSelector).on('touchstart, click', function _onOutsideClick(evt) {
                //if not nav container or a decendant of nav container
                if( !$this.is(evt.target) && $this.has(evt.target).length === 0 ) {
                    closeNav();
                }
            });
        }
    }

    //KEYBOARD FUNCTIONALITY
    if( options.showTabsOnFocus ) {
        // Adding quick Tab Functionality for Navigation
        $('nav.main-nav > ul > li.menu-item-has-children > a').on('focus', function () {
            $(this).siblings('ul').addClass('tab-show');
        }).on('blur',function(){
            $(this).siblings('ul').removeClass('tab-show');
        });

      // focusing on sub menu item show its dropdown
        $('nav.main-nav > ul > li.menu-item-has-children > ul > li > a').on('focus', function () {
            $(this).parent().parent('ul').addClass('tab-show');
        }).on('blur',function(){
            $(this).parent().parent('ul').removeClass('tab-show');
        });
    }

    const sublevelNav = function() {
		$this.find('span.main-nav__dropper').each(function(){
			$(this).on('touchstart, click', function(event) {

				event.stopPropagation();
				event.preventDefault();

				//if menu is open and the subnav is not visible and subnav exists
				if ( _menuIsOpen() && !$(this).parent().next().is(':visible') && $(this).parent().next().length > 0) {

					//close what's already open at the same level
					//remove toggle class from the li and slide up its child ul
					$(this).parent().parent().siblings().removeClass('toggle').children('ul').slideUp(250);

					//expand current click
					$(this).parent().parent().addClass('toggle');
					$(this).parent().next('ul').slideDown(250);

				}
				else if ( _menuIsOpen() && $(this).parent().next('ul').is(':visible') ) {
						//close this item
						$(this).parent().parent().removeClass('toggle');
						$(this).parent().next('ul').slideUp(250);
				}

			}); //end bind
		});//end find span.dropper
	};//end sublevelNav

    const activeToggleFn = function(){
        //on mobile check for active navigation and set open accordingly
        if( $menuButton.is(':visible') ){

            $this.find('ul.menu li.current_page_item, ul.menu li.current_page_ancestor').each(function(){
                if( !$(this).hasClass('toggle') ){
                    $(this).addClass('toggle');
                }
                if( !$(this).children('ul').is(':visible') ){
                    $(this).children('ul').show();
                }
            });
        }
    } //end activeToggleFn


    $menuButton.on( 'touchstart, click', function(event) {

        event.stopPropagation();
        event.preventDefault();

        if ( _menuIsOpen() ) {
            closeNav();
        }
        else{
            openNav();
        }
    }) //end button on

    //ADD EXPANDER ICON
    $this.find('li.menu-item-has-children > a').each(function(){
        if( $(this).next('ul').length ) {
            $(this).append('<span class="main-nav__dropper"></span>');
        }
    });

    //IF DROPDOWN TYPE SET CLASSNAME
    if( options.navType === 'dropdown' ){
        $dropdownElem.addClass('main-nav-dropdown');
    }

    sublevelNav()
    activeToggleFn()

    $(window).on('resize', debounce(options.debounceTime, function() {

        if( !$menuButton.is(':visible') ) {
            //close mobile menu
            if ( _menuIsOpen() ) {
                //closeNav() - we dont want to run the function cause we dont want all transitions with the dropdown
                $menuButton.removeClass( options.activeClass );
                $wrapper.removeClass( options.menuOpenWrapperClass );
                $this.removeAttr('style');
            }
            //remove any inline styles from subnavigation
            $this.find( 'ul' ).removeAttr( 'style' )
            $this.find('.menu-item-has-children').removeClass('toggle')
            $this.removeAttr('style')
        }
        else{
            activeToggleFn()
        }

    }));

    return this;
}

})(jQuery)
