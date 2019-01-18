(function($) {

/**
 * define responsive nav component as its own jQuery plugin
 */
$.fn.responsiveNav = function( options ) {

	options = $.extend({}, {
		wrapperSelector: '.site-wrapper',
		menuButtonSelector: '.menu-btn',
		menuOpenClass: 'menu-open',
		menuButtonActiveClass: 'active',
		navType: 'offCanvas'
	}, options);

	var $this = $(this),
		menuOpen = false,
		$wrapper = $( options.wrapperSelector ),
		$menuButton = $( options.menuButtonSelector );

	if( options.navtype === 'dropdown' ){
		$this.addClass('main-nav-dropdown');
	}

	var closeNav = function() {

		if( options.navType === 'dropdown' ){
			$this.slideUp();
		}
		else{
			$wrapper.removeClass( options.menuOpenClass );
		}

		$menuButton.removeClass( options.menuButtonActiveClass );

		menuOpen = false;
	};

	var bodyClickFn = function(evt) {
		//if not nav container or a decendant of nav container
		if( !$('nav.main-nav').is(evt.target) && $('nav.main-nav').has(evt.target).length === 0 ) {
			closeNav();
			$('.site-wrapper').unbind( 'touchstart, click', bodyClickFn );
		}
	};

	var keyboardTabFn = function(){
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
	};

	var menuBtnFn = function() {

		$menuButton.bind( 'touchstart, click', function(event) {

			event.stopPropagation();
			event.preventDefault();

			if ( menuOpen ) {
				closeNav();
			}
			else{
				if( options.navType === 'dropdown' ){
					$this.slideDown();
				}
				else{
					$wrapper.addClass( options.menuOpenClass );
				}

				$(this).addClass( options.menuButtonActiveClass );

				menuOpen = true;

				$('.site-wrapper').bind( 'touchstart, click', bodyClickFn );

			}
		});

		//ADD EXPANDER ICON
		$this.find('li.menu-item-has-children > a').each(function(){
			if( $(this).next('ul').length ) {
				$(this).append('<span class="dropper"></span>');
			}
		});

	}; //end menuBtnFn

	var sublevelNav = function() {
		$this.find('span.dropper').each(function(){
			$(this).bind('touchstart, click', function(event) {

				event.stopPropagation();
				event.preventDefault();

				//if menu is open and the subnav is not visible and subnav exists
				if ( menuOpen && !$(this).parent().next().is(':visible') && $(this).parent().next().length > 0) {

					//close what's already open at the same level
					//remove toggle class from the li and slide up its child ul
					$(this).parent().parent().siblings().removeClass('toggle').children('ul').slideUp(250);

					//expand current click
					$(this).parent().parent().addClass('toggle');
					$(this).parent().next('ul').slideDown(250);

				}
				else if ( menuOpen && $(this).parent().next('ul').is(':visible') ) {
						//close this item
						$(this).parent().parent().removeClass('toggle');
						$(this).parent().next('ul').slideUp(250);
				}

			}); //end bind
		});//end find span.dropper
	};//end sublevelNav

	var activeToggleFn = function(){
		//on mobile check for active navigation and set open accordingly
		if( $menuButton.is(':visible') ){

			$this.find('ul.menu li.menu-item-has-children.current-menu-item, ul.menu li.menu-item-has-children.current-menu-ancestor').each(function(){
					if( !$(this).hasClass('toggle') ){
						$(this).addClass('toggle');
					}
					if( !$(this).children('ul').is(':visible') ){
						$(this).children('ul').show();
					}
			});
		}
	}; //end activeToggleFn

	menuBtnFn();
	sublevelNav();
	keyboardTabFn();
	activeToggleFn();

	$(window).resize(function(){

		if( !$menuButton.is(':visible') ) {
			//close mobile menu
			if ( menuOpen ) {
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
	});

	return this;
};
})(jQuery);
