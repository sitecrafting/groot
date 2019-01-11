/* globals jQuery */
import 'fitvids.1.1.0'
import 'flexslider'

import responsiveNav from './responsive-nav.jquery.js'
import accordion from './jquery.accordion.js'

(($) => {

  $.fn.responsiveNav = responsiveNav
  $.fn.accordion = accordion

  //main hero slideshow
  $('.hero.flexslider').flexslider()

  // Make nav menu nice & responsive
  $('nav.main-nav').responsiveNav({
    navType: 'offCanvas', //default option for dropdown type use 'dropdown'
    closeOnOutsideClick: true,
    showTabsOnFocus: true,
  })

  $('nav.side-nav').responsiveNav({
    menuButtonSelector: '.side-nav-trigger',
    activeClass: 'panel-open',
    dropdownSelector: '.side-menu',
    navType: 'dropdown',
  })

  // Custom Select Boxes
  $('select').wrap('<div class="selectbox-container"></div>')

  // Responsive Videos
  $('.rtecontent').fitVids()

  // Accordions
  $('dl.accordion').accordion()

  // gallery flexslider
  $('.gallery-slideshow.flexslider').flexslider({
    controlNav: 'thumbnails'
  })

})(jQuery)
