/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js/src/jquery.accordion.js":
/*!************************************!*\
  !*** ./js/src/jquery.accordion.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * ## jQueryAccordion module Usage
 *
 * ### Markup:
 * <dl class="accordion">
 *   <dt data-id="tab1"><h3><button id="accordion_panel_title_1">Tab Title</button></h3></dt>
 *   <dd id="accordion_panel_1">Panel Content</dd>
 *   <dt data-id="tab1"><h3><button id="accordion_panel_title_2">Tab Title</button></h3></dt>
 *   <dd id="accordion_panel_2">Panel Content</dd>
 * </dl>
 *
 * ### JS:
 * $.fn.accordion = require('./jquery.accordion.js');
 * $('dl.accordion').accordion();
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((function ($) {
  return function () {
    //VARIABLES
    var $tabs = $('dl.accordion dt'),
      hashtag = window.location.hash,
      hashPanelId = window.location.hash.replace('#', '');

    //FUNCTIONS
    var toggleAccPanelFn = function toggleAccPanelFn($this_tab, $this_panel) {
      if ($this_tab.hasClass('active') && $this_panel.is(':visible')) {
        $this_panel.slideUp();
        $this_tab.removeClass('active').addClass('inactive');
        $this_tab.find('button').attr('aria-expanded', 'false');
      } else {
        $this_panel.slideDown();
        $this_tab.addClass('active').removeClass('inactive');
        $this_tab.find('button').attr('aria-expanded', 'true');
      }
    };

    //TAB ANCHOR CLICKS
    $tabs.find('button').on('click', function (e) {
      e.preventDefault();
      var this_tab = $(this).closest('dt');
      var this_panel = this_tab.next();
      toggleAccPanelFn(this_tab, this_panel);
    });
    if (hashtag && $('dl.accordion dt button#' + hashPanelId).length > 0) {
      var selected_tab = $('dl.accordion dt button#' + hashPanelId).closest('dt');
      var selected_panel = selected_tab.next();

      //open panel
      toggleAccPanelFn(selected_tab, selected_panel);

      //we dont need to control the scroll, the hash/id set will do that for us
    }
  };
})(jQuery));

/***/ }),

/***/ "./js/src/responsive-nav.js":
/*!**********************************!*\
  !*** ./js/src/responsive-nav.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ responsiveNav)
/* harmony export */ });
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
function responsiveNav(thisNav, overwrites) {
  var defaultOptions = {
    desktopEms: '81.25em',
    // 1240px
    wrapperSelector: '.site-wrapper',
    menuOpenWrapperClass: 'menu-open',
    menuButtonSelector: '.menu-btn',
    navType: 'offCanvas',
    dropdownSelector: '',
    closeOnOutsideClick: false
  };
  var options = Object.assign({}, defaultOptions, overwrites);

  // Define the media query for when we are on the desktop menu - used to control events on the subnav expander
  var mediaQuery = window.matchMedia("only screen and (min-width: ".concat(options.desktopEms, ")"));
  var wrapper = document.querySelector(options.wrapperSelector),
    menuButton = document.querySelector(options.menuButtonSelector);

  // target dropdown element (element that slides open), which may be distinct from thisNav
  var dropdownElem = options.dropdownSelector ? document.querySelector(options.dropdownSelector) : thisNav;
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
  var closeNavStrategies = {
    dropdown: _closeDropdownNav,
    offCanvas: _closeOffCanvasNav
  };

  //set what type of closeNav we want
  var closeNavStrategy = closeNavStrategies[options.navType] || _closeOffCanvasNav;

  //THIS IS THE ACTUAL FUNCTION THAT GETS CALLED TO CLOSE THE NAV
  function closeNav() {
    closeNavStrategy(dropdownElem);
    wrapper.classList.remove(options.menuOpenWrapperClass);
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
  var openNavStrategies = {
    dropdown: _openDropdownNav,
    offCanvas: _openOffCanvasNav
  };
  //set what type of closeNav we want
  var openNavStrategy = openNavStrategies[options.navType] || _openOffCanvasNav;

  //THIS IS THE ACTUAL FUNCTION THAT GETS CALLED TO OPEN THE NAV
  function openNav() {
    openNavStrategy(dropdownElem);
    wrapper.classList.add(options.menuOpenWrapperClass);
    menuButton.setAttribute('aria-expanded', true);
    if (options.closeOnOutsideClick) {
      // close the menu when the user clicks anywhere outside it
      wrapper.addEventListener('click', function (event) {
        if (!thisNav.contains(event.target)) {
          closeNav();
        }
      });
    }
  }

  //Toggle Menu
  menuButton.addEventListener('click', function (event) {
    event.stopPropagation();
    event.preventDefault();
    if (_menuIsOpen()) {
      closeNav();
    } else {
      openNav();
    }
  }); //end button on

  //function used for mobile only
  function handleSubnavExpander(event) {
    event.stopPropagation();
    event.preventDefault();
    var expanderBtn = event.currentTarget;
    var subNav = expanderBtn.parentElement.nextElementSibling; //traverse up to the top level <a> tag then get the subnav ul which is a sibling
    var parentLi = expanderBtn.parentElement.parentElement;

    //if its not visible - open this subnav
    if (subNav.getAttribute('data-visible') == 'false') {
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
    var allSubnavs = thisNav.querySelectorAll('[data-visible="true"]');
    allSubnavs.forEach(function (openSubNav) {
      openSubNav.setAttribute('data-visible', false);
      var siblingExpander = openSubNav.previousElementSibling.querySelector('.nav-expander');
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
  function handleSubnavExpanderDesktop(event) {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    var expanderBtn = event.currentTarget;
    var subNav = expanderBtn.parentElement.nextElementSibling;

    //if its not visible - open this subnav
    if (subNav.getAttribute('data-visible') == 'false') {
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
    var ancestorItems = thisNav.querySelectorAll('li.current-menu-ancestor, li.current-menu-item');
    ancestorItems.forEach(function (li) {
      var expanderBtn = li.querySelector('.nav-expander');
      var subNav = expanderBtn ? expanderBtn.parentElement.nextElementSibling : null;
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
  var subnavExpanders = thisNav.querySelectorAll('.nav-expander');

  // Function to handle the behavior based on the media query
  function handleMediaQueryChange(e) {
    if (e.matches) {
      // Media query matches Screen Size is desktop menu

      subnavExpanders.forEach(function (expander) {
        /*
        For each expander add the keydown listenter for desktop expanding
        remove the click listener
        */
        expander.addEventListener('keydown', handleSubnavExpanderDesktop);
        expander.removeEventListener('click', handleSubnavExpander);
      });
    } else {
      // Media query does not match so its the mobile menu
      subnavExpanders.forEach(function (expander) {
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

/***/ }),

/***/ "./node_modules/fitvids.1.1.0/jquery.fitvids.js":
/*!******************************************************!*\
  !*** ./node_modules/fitvids.1.1.0/jquery.fitvids.js ***!
  \******************************************************/
/***/ (() => {

/*jshint browser:true */
/*!
* FitVids 1.1
*
* Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
*/

;(function( $ ){

  'use strict';

  $.fn.fitVids = function( options ) {
    var settings = {
      customSelector: null,
      ignore: null
    };

    if(!document.getElementById('fit-vids-style')) {
      // appendStyles: https://github.com/toddmotto/fluidvids/blob/master/dist/fluidvids.js
      var head = document.head || document.getElementsByTagName('head')[0];
      var css = '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}';
      var div = document.createElement("div");
      div.innerHTML = '<p>x</p><style id="fit-vids-style">' + css + '</style>';
      head.appendChild(div.childNodes[1]);
    }

    if ( options ) {
      $.extend( settings, options );
    }

    return this.each(function(){
      var selectors = [
        'iframe[src*="player.vimeo.com"]',
        'iframe[src*="youtube.com"]',
        'iframe[src*="youtube-nocookie.com"]',
        'iframe[src*="kickstarter.com"][src*="video.html"]',
        'object',
        'embed'
      ];

      if (settings.customSelector) {
        selectors.push(settings.customSelector);
      }

      var ignoreList = '.fitvidsignore';

      if(settings.ignore) {
        ignoreList = ignoreList + ', ' + settings.ignore;
      }

      var $allVideos = $(this).find(selectors.join(','));
      $allVideos = $allVideos.not('object object'); // SwfObj conflict patch
      $allVideos = $allVideos.not(ignoreList); // Disable FitVids on this video.

      $allVideos.each(function(){
        var $this = $(this);
        if($this.parents(ignoreList).length > 0) {
          return; // Disable FitVids on this video.
        }
        if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; }
        if ((!$this.css('height') && !$this.css('width')) && (isNaN($this.attr('height')) || isNaN($this.attr('width'))))
        {
          $this.attr('height', 9);
          $this.attr('width', 16);
        }
        var height = ( this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10))) ) ? parseInt($this.attr('height'), 10) : $this.height(),
            width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
            aspectRatio = height / width;
        if(!$this.attr('name')){
          var videoName = 'fitvid' + $.fn.fitVids._count;
          $this.attr('name', videoName);
          $.fn.fitVids._count++;
        }
        $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100)+'%');
        $this.removeAttr('height').removeAttr('width');
      });
    });
  };
  
  // Internal counter for unique video names.
  $.fn.fitVids._count = 0;
  
// Works with either jQuery or Zepto
})( window.jQuery || window.Zepto );


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!**************************!*\
  !*** ./js/src/common.js ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var fitvids_1_1_0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fitvids.1.1.0 */ "./node_modules/fitvids.1.1.0/jquery.fitvids.js");
/* harmony import */ var fitvids_1_1_0__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fitvids_1_1_0__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _responsive_nav_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./responsive-nav.js */ "./js/src/responsive-nav.js");
/* harmony import */ var _jquery_accordion_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./jquery.accordion.js */ "./js/src/jquery.accordion.js");
/* globals jQuery */



(function ($) {
  //$.fn.responsiveNav = responsiveNav
  $.fn.accordion = _jquery_accordion_js__WEBPACK_IMPORTED_MODULE_2__["default"];
  var html = document.querySelector('html');
  html.classList.remove('no-js');
  html.classList.add('js');

  // Make nav menu nice & responsive
  var mainNav = document.querySelector('nav.main-nav');
  if (mainNav) {
    (0,_responsive_nav_js__WEBPACK_IMPORTED_MODULE_1__["default"])(mainNav, {
      desktopEms: '81.25em',
      // size of screen for desktop menu, should match less media query for @desktop-menu
      wrapperSelector: '.main-nav',
      navType: 'offCanvas',
      closeOnOutsideClick: true
    });
  }

  //Make subnav menu responsive
  var subNav = document.querySelector('nav.subnav');
  if (subNav) {
    (0,_responsive_nav_js__WEBPACK_IMPORTED_MODULE_1__["default"])(subNav, {
      wrapperSelector: '.subnav-wrapper',
      navType: 'dropdown',
      menuButtonSelector: '.subnav-mobile-toggle'
    });
  }

  // Responsive Videos
  $('.rtecontent, .video').fitVids();

  // Accordions
  $('dl.accordion').accordion();

  //filter on change
  $('#categoryFilter').on('change', function () {
    var catLink = $(this).val();
    window.location = catLink;
  });
})(jQuery);
})();

/******/ })()
;
//# sourceMappingURL=common.js.map