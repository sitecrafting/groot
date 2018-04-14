/* globals jQuery */
require('fitvids.1.1.0');
require('flexslider');

(function($) {

  $.fn.responsiveNav = require('./responsive-nav.jquery.js');
  $.fn.accordion = require('./jquery.accordion.js');

  //main hero slideshow
  $('.hero.flexslider').flexslider();

  // Make nav menu nice & responsive
  $('nav.main-nav').responsiveNav({
    navType: 'offCanvas', //default option for dropdown type use 'dropdown'
    closeOnOutsideClick: true,
    showTabsOnFocus: true,
  });
  $('nav.side-nav').responsiveNav({
    menuButtonSelector: '.side-nav-trigger',
    activeClass: 'panel-open',
    dropdownSelector: '.side-menu',
    navType: 'dropdown',
  });

  // Custom Select Boxes
  $('select').wrap('<div class="selectbox-container"></div>');

  // Responsive Videos
  $('.rtecontent').fitVids();

  // Accordions
  $('dl.accordion').accordion();

  // gallery flexslider
  $('.gallery-slideshow.flexslider').flexslider({
    controlNav: 'thumbnails'
  });

})(jQuery);
