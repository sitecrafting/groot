/* globals module, jQuery */

var debounce = require('throttle-debounce/debounce');

/**
 * jQueryResponsiveNav module
 *
 * Usage:
 *
 * ```js
 * $.fn.responsiveNav = require('./responsive-nav.jquery.js');
 *
 * $('.my-nav-element').responsiveNav({
 *   navType: 'offCanvas'
 * });
 * ```
 */
module.exports = (function($){

  return function jQueryResponsiveNav( options ) {

    options = $.extend({}, {
      wrapperSelector: '.site-wrapper',
      menuButtonSelector: '.menu-btn',
      menuOpenClass: 'menu-open',
      menuButtonActiveClass: 'active',
      navType: 'offCanvas',
      debounceTime: 150,
      closeOnOutsideClick: false,
      showTabsOnFocus: false,
    }, options);

    var $this = $(this),
      $wrapper = $( options.wrapperSelector ),
      $menuButton = $( options.menuButtonSelector );

    function _menuIsOpen() {
      return $menuButton.hasClass( options.menuButtonActiveClass );
    }

    function _closeDropdownNav() {
      $this.slideUp();
    }

    function _closeOffCanvasNav() {
      $wrapper.removeClass( options.menuOpenClass );
    }

    var closeNavStrategies = {
      dropdown: _closeDropdownNav,
      offCanvas: _closeOffCanvasNav,
    };

    var closeNavStrategy = closeNavStrategies[options.navType] || _closeOffCanvasNav;

    function closeNav() {
      closeNavStrategy();
      $menuButton.removeClass( options.menuButtonActiveClass );
    }


    function _openDropdownNav() {
      $this.slideDown();
    }

    function _openOffCanvasNav() {
      $wrapper.addClass( options.menuOpenClass );
    }

    var openNavStrategies = {
      dropdown: _openDropdownNav,
      offCanvas: _openOffCanvasNav,
    };
    var openNavStrategy = openNavStrategies[options.navType] || _openOffCanvasNav;

    function openNav() {
      openNavStrategy();

      $(this).addClass( options.menuButtonActiveClass );

      if (options.closeOnOutsideClick) {
        // close the menu when the user clicks anywhere outside it
        $(options.wrapperSelector).one(
          'touchstart, click',
          function _onOutsideClick(evt) {
            //if not nav container or a decendant of nav container
            if( !$this.is(evt.target) && $this.has(evt.target).length === 0 ) {
              closeNav();
            }
          });
      }
    }




    if (options.showTabsOnFocus) {
      // Adding quick Tab Functionality for Navigation
      $('nav.main-nav > ul > li.menu-item-has-children > a').focus( function () {
        $(this).siblings('ul').addClass('tab-show');
      }).blur(function(){
        $(this).siblings('ul').removeClass('tab-show');
      });

      // focusing on sub menu item show its dropdown
      $('nav.main-nav > ul > li.menu-item-has-children > ul > li > a').focus( function () {
        $(this).parent().parent('ul').addClass('tab-show');
      }).blur(function(){
        $(this).parent().parent('ul').removeClass('tab-show');
      });
    }


    var secondlevelNav = function() {
      $this.find('ul.menu > li.menu-item-has-children > a > span.dropper').each(function(){
        $(this).on('touchstart, click', function(event) {

          event.stopPropagation();
          event.preventDefault();

          if ( _menuIsOpen() && !$(this).parent().next().is(':visible') && $(this).parent().next().length > 0) {

            //close what's already open
            $this.find('ul.menu li').removeClass('toggle');
            $this.find('ul.menu > li ul').slideUp(250);

            //expand current click
            $(this).parent().parent().addClass('toggle');
            $(this).parent().next('ul').slideDown(250);

          }
          else if ( _menuIsOpen() && $(this).parent().next('ul').is(':visible') ) {
            //close this item
            $(this).parent().parent().removeClass('toggle');
            $(this).parent().next('ul').slideUp(250);
          }

        }); //end on
      });//end find span.dropper
    };//end secondlevelNav

    var thirdlevelNav = function() {
      $this.find('ul.menu > li.menu-item-has-children > ul > li.menu-item-has-children > a > span.dropper').each(function(){
        $(this).on('touchstart, click', function(event) {

          event.stopPropagation();
          event.preventDefault();

          if ( _menuIsOpen() && !$(this).parent().next().is(':visible') && $(this).parent().next().length > 0) {

            //close what's already open
            $this.find('ul.menu > li ul > li').removeClass('toggle');
            $this.find('ul.menu > li ul > li ul').slideUp(250);

            //expand current click
            $(this).parent().parent().addClass('toggle');
            $(this).parent().next('ul').slideDown(250);

          }
          else if ( _menuIsOpen() && $(this).parent().next('ul').is(':visible') ) {

            //close this item
            $(this).parent().parent().removeClass('toggle');
            $(this).parent().next('ul').slideUp(250);
          }

        }); //end on
      });//end find span.dropper
    };//end fn thirdlevelNav

    var activeToggleFn = function(){
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
    }; //end activeToggleFn


    $menuButton.on( 'touchstart, click', function(event) {

      event.stopPropagation();
      event.preventDefault();

      if ( _menuIsOpen() ) {
        closeNav();
      }
      else{
        openNav();
      }
    }); //end button on

    //ADD EXPANDER ICON
    $this.find('li.menu-item-has-children > a').each(function(){
      if( $(this).next('ul').length ) {
        $(this).append('<span class="dropper"></span>');
      }
    });



    secondlevelNav();
    thirdlevelNav();
    activeToggleFn();

    $(window).resize( debounce(function() {

      if( !$menuButton.is(':visible') ) {
        //close mobile menu
        if ( _menuIsOpen() ) {
          closeNav();
        }
        //remove any inline styles from subnavigation
        $this.find( 'ul' ).removeAttr( 'style' );
        $this.find('.menu-item-has-children').removeClass('toggle');
        $this.removeAttr('style');
      }
      else{
        activeToggleFn();
      }
    }, options.debounceTime));

    return this;
  };

})(jQuery);
