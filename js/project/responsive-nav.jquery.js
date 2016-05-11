(function($) {

/**
 * define responsive nav component as its own jQuery extension
 */
$.fn.responsiveNav = function( options ) {


	options = $.extend({}, {
		wrapperSelector: '.site-wrapper',
		menuButtonSelector: '.menu-btn',
		menuOpenClass: 'menu-open',
		menuButtonActiveClass: 'active',
	}, options);

	var $this = $(this),
		menuOpen = false,
		$wrapper = $( options.wrapperSelector ),
		$menuButton = $( options.menuButtonSelector );

	var closeNav = function() {
		$wrapper.removeClass( options.menuOpenClass );
		$menuButton.removeClass( options.menuButtonActiveClass );

		//remove any inline styles from subnavigation
		$this.find( 'ul' ).removeAttr( 'style' );

		menuOpen = false;
	};

	var bodyClickFn = function(evt) {
		//if not nav container or a decendant of nav container
		if( !$this.is(evt.target) && $this.has(evt.target).length === 0 ) {
			closeNav();
			$(document).unbind( 'touchstart, click', bodyClickFn );
		}
	};

	var menuBtnFn = function() {

		$menuButton.bind( 'touchstart, click', function(event) {

			event.stopPropagation();
			event.preventDefault();

			if ( menuOpen ) {
				closeNav();
			}
			else{
				$wrapper.addClass( options.menuOpenClass );
				$(this).addClass( options.menuButtonActiveClass );

				menuOpen = true;
			}
		}); //end button bind

		//ADD EXPANDER ICON
		$this.find('li.menu-item-has-children > a').each(function(){
			if( $(this).next('ul').length ) {
				$(this).append('<span class="dropper"></span>');
			}
		});

	}; //end menuBtnFn

	var secondlevelNav = function() {
		$this.find('ul.menu > li.menu-item-has-children > a > span.dropper').each(function(){
			$(this).bind('touchstart, click', function(event) {

				event.stopPropagation();
				event.preventDefault();

				if ( menuOpen && !$(this).parent().next().is(':visible') && $(this).parent().next().length > 0) {

					//close what's already open
					$this.find('ul.menu li').removeClass('toggle');
					$this.find('ul.menu > li ul').slideUp(250);

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
	};//end secondlevelNav

	var thirdlevelNav = function() {
		$this.find('ul.menu > li.menu-item-has-children > ul > li.menu-item-has-children > a > span.dropper').each(function(){
			$(this).bind('touchstart, click', function(event) {

					event.stopPropagation();
					event.preventDefault();

				if ( menuOpen && !$(this).parent().next().is(':visible') && $(this).parent().next().length > 0) {


					//close what's already open
					$this.find('ul.menu > li ul > li').removeClass('toggle');
					$this.find('ul.menu > li ul > li ul').slideUp(250);

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
		else{

		}
	}; //end activeToggleFn


	menuBtnFn();
	secondlevelNav();
	thirdlevelNav();
	activeToggleFn();

	$(window).resize(function(){
		if( !$menuButton.is(':visible') ) {
			closeNav();
			$this.find('ul.menu ul').removeAttr('style');
		}
		else{
			activeToggleFn();
		}
	});

	return this;
};
})(jQuery);