(function($) {

/**
 * define responsive nav component as its own jQuery extension
 */
$.fn.mobileSidenav = function( options ) {

	options = $.extend({}, {
		triggerButtonSelector: '.side-nav-trigger',
		sidenavWrapperClass: '.side-menu',
		sidenavOpenClass: 'panel-open',
		menuButtonActiveClass: 'active'
	}, options);

	var $this = $(this), //nav.side-nav
		sidenavOpen = false,
		$sidenavWraper = $( options.sidenavWrapperClass ),
		$triggerButton = $( options.triggerButtonSelector );

	var closeSidenav = function() {
		$sidenavWraper.slideUp();
		$this.removeClass( options.sidenavOpenClass );

		sidenavOpen = false;
	};

	var triggerBtnFn = function() {

		$triggerButton.bind( 'touchstart, click', function(event) {

			event.stopPropagation();
			event.preventDefault();

			if ( sidenavOpen ) {
				closeSidenav();
			}
			else{
				$sidenavWraper.slideDown();
				$this.addClass( options.sidenavOpenClass );
				sidenavOpen = true;

			}
		}); //end button bind



	}; //end menuBtnFn

	triggerBtnFn();

	$(window).resize( $.debounce(function() {
			if( !$triggerButton.is(':visible') ) {
				//close mobile menu
				if ( sidenavOpen ) {
					$sidenavWraper.hide(); //when resizing we want this to be immediate
					$this.removeClass( options.sidenavOpenClass );
					sidenavOpen = false;
				}
				$sidenavWraper.removeAttr('style');
			}
	}, 150));

	return this;
};
})(jQuery);
