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
		});

	};

	var secondlevelNav = function() {
		$this.find('ul li a').each(function(){
			$(this).bind('touchstart, click', function(event) {

				if ( menuOpen && !$(this).next().is(':visible') && $(this).next().length > 0) {

					event.stopPropagation();
					event.preventDefault();

					//close what's already open
					$this.find('ul li ul').slideUp();

					//expand current click
					$(this).parent().children( 'ul' ).slideDown();
				}
			});
		});
	};


	menuBtnFn();
	secondlevelNav();

	$(window).resize(function(){
		if( ! $menuButton.is(':visible') ) {
			closeNav();
		}
	});

	return this;
};
})(jQuery);