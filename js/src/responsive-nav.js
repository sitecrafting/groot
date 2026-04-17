/**
 * Responsive navigation controller for main nav and subnav instances.
 *
 * Features:
 * - Supports two nav strategies:
 *   - offCanvas: toggles visibility with data-visible for overlay menus
 *   - dropdown: uses shared open/close height animation helpers
 * - Keeps aria-expanded in sync for menu toggle buttons and subnav expanders
 * - Handles desktop and mobile behavior via configurable media query breakpoint
 * - Desktop subnav behavior:
 *   - keyboard open/close (Enter/Space)
 *   - Escape closes open subnavs and restores focus to triggering expander
 *   - click outside closes open subnavs
 *   - hover listeners keep aria-expanded aligned with CSS :hover visibility
 * - Mobile behavior:
 *   - click + keyboard support for expanders
 *   - nested menus keep ancestor path open while closing same-level siblings
 *   - Escape closes all subnavs and the nav wrapper
 *   - current-menu-ancestor paths auto-open on mobile
 * - Optional outside-click close for the main nav wrapper
 * - Offcanvas accessibility support using inert on non-nav page regions
 * - Optional nav-owned search dialog sync (close search when nav closes)
 *
 * Usage:
 * const mainNav = document.querySelector('nav.main-nav');
 * if (mainNav) {
 *   responsiveNav(mainNav, {
 *     navType: 'offCanvas',
 *     closeOnOutsideClick: true,
 *   });
 * }
 */
import { openDropdown, closeDropdown } from './dropdown-animation-plugin.js';

export default function responsiveNav( thisNav, overwrites ) {

    // ---------------------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------------------

    const defaultOptions = {
        desktopEms: '81.25em', // 1240px
        wrapperSelector: '.site-wrapper',
        menuOpenWrapperClass: 'menu-open',
        menuButtonSelector: '.menu-btn',
        navType: 'offCanvas',
        dropdownSelector: '',
        closeOnOutsideClick: false,
        // If true, search dialog is considered part of this nav and syncs with nav open/close state.
        hasSearchInNav: false,
        searchDialogSelector: '#searchDialog',
        // Elements outside nav that should be made inert when offCanvas is open.
        offCanvasInertSelectors: ['main', '.site-footer', '.logo'],
    };
    let options = Object.assign({}, defaultOptions, overwrites);

    // Desktop breakpoint controls expander behavior and listener wiring.
    const mediaQuery = window.matchMedia(`only screen and (min-width: ${options.desktopEms})`);

    // Core elements for the configured nav instance.
    let wrapper = document.querySelector(options.wrapperSelector ),
        menuButton = document.querySelector(options.menuButtonSelector),
        dropdownElem = options.dropdownSelector ? document.querySelector(options.dropdownSelector) : thisNav;

    // Collections used across helper functions.
    const subnavExpanders = thisNav.querySelectorAll('.nav-expander');
    const topLevelItems = thisNav.querySelectorAll(':scope > ul > li');

    const navSearchDialog = options.hasSearchInNav && options.searchDialogSelector
        ? document.querySelector(options.searchDialogSelector)
        : null;

    // Resolve inert targets once from the centralized selector list.
    // Take this list of CSS selectors, find every element on the page that matches them, make sure no element is listed twice, and give me the final result as an array.
    const offCanvasInertTargets = [
        ...new Set(
            (Array.isArray(options.offCanvasInertSelectors) ? options.offCanvasInertSelectors : [])
                .flatMap(selector => Array.from(document.querySelectorAll(selector)))
        ),
    ];

    // Tracks the last desktop expander so Escape can restore focus.
    let _activeSubnavExpander = null;

    // ---------------------------------------------------------------------
    // Strategy helpers
    // ---------------------------------------------------------------------

    function _closeNavSearchDialog() {
        if (navSearchDialog && navSearchDialog.open) {
            navSearchDialog.close();
        }
    }

    function _menuIsOpen() {
        // If the menu button reports expanded, nav is treated as open.
        return menuButton.getAttribute('aria-expanded') === 'true' ? true : false;
    }

    function _openOffCanvasNav() {
        thisNav.setAttribute('data-visible', true);
    }
    function _closeOffCanvasNav() {
        thisNav.setAttribute('data-visible', false);
    }

    const closeNavStrategies = {
        dropdown: closeDropdown, //imported function
        offCanvas: _closeOffCanvasNav,
    }
    const openNavStrategies = {
        dropdown: openDropdown, //imported function
        offCanvas: _openOffCanvasNav,
    }

    // Fallback to offCanvas if a navType key is missing.
    const closeNavStrategy = closeNavStrategies[options.navType] || _closeOffCanvasNav;
    const openNavStrategy = openNavStrategies[options.navType] || _openOffCanvasNav;

    // ---------------------------------------------------------------------
    // Main nav open/close handlers
    // ---------------------------------------------------------------------

    // Named handler allows proper add/remove without accumulating anonymous listeners.
    function _handleNavOutsideClick(event) {
        if( !thisNav.contains(event.target) ){
            closeNav();
        }
    }

    // Mobile-only Escape behavior closes entire nav and restores trigger focus.
    function _handleMobileEscape(event) {
        if (event.key === 'Escape') {
            closeAllSubnavs();
            closeNav();
            menuButton.focus();
        }
    }

    // Calls the active strategy and then wires global nav state/listeners.
    function openNav() {
        openNavStrategy(dropdownElem);
        wrapper.classList.add( options.menuOpenWrapperClass );
        menuButton.setAttribute('aria-expanded', true);

        // Offcanvas only: remove non-nav content from keyboard focus order.
        if (options.navType === 'offCanvas') {
            offCanvasInertTargets.forEach(target => target.setAttribute('inert', ''));
        }

        if (options.closeOnOutsideClick) {
            // Close menu when user clicks outside the nav element.
            wrapper.addEventListener('click', _handleNavOutsideClick);
        }

        if (!mediaQuery.matches) {
            document.addEventListener('keydown', _handleMobileEscape);
        }
    }
    function closeNav() {
        closeNavStrategy(dropdownElem);
        wrapper.classList.remove( options.menuOpenWrapperClass );
        menuButton.setAttribute('aria-expanded', false);

        // Keep nav-owned search dialog state in sync with nav close.
        _closeNavSearchDialog();

        // Restore normal document focusability.
        offCanvasInertTargets.forEach(target => target.removeAttribute('inert'));

        wrapper.removeEventListener('click', _handleNavOutsideClick);
        document.removeEventListener('keydown', _handleMobileEscape);
    }
    
    // Main trigger toggle.
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

    // ---------------------------------------------------------------------
    // Subnav behavior helpers
    // ---------------------------------------------------------------------

    // Close same-level sibling subnavs while preserving open ancestors.
    function _closeSiblingSubnavs(expanderBtn) {
        const parentLi = expanderBtn.parentElement ? expanderBtn.parentElement.parentElement : null;
        const parentUl = parentLi ? parentLi.parentElement : null;
        if (!parentUl) {
            return;
        }

        parentUl.querySelectorAll(':scope > li > [data-visible="true"]').forEach(openSubNav => {
            const siblingExpander = openSubNav.previousElementSibling
                ? openSubNav.previousElementSibling.querySelector('.nav-expander')
                : null;

            openSubNav.setAttribute('data-visible', false);
            if (siblingExpander) {
                siblingExpander.setAttribute('aria-expanded', false);
            }
        });
    }

    // Handles expander activation for both keyboard and click paths.
    function handleSubnavExpander(event){
        // Keydown path: only respond to Enter and Space.
        if( event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ' ) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();

        const expanderBtn = event.currentTarget;
        const subNav = expanderBtn.parentElement.nextElementSibling; //traverse up to the parent then get the next sibling which is the subnav

        if( subNav.getAttribute('data-visible') === 'false' ){
            if (mediaQuery.matches) {
                // Desktop: only one open branch at a time.
                closeAllSubnavs();
            } else {
                // Mobile: preserve ancestors, collapse siblings.
                _closeSiblingSubnavs(expanderBtn);
            }

            // Open target subnav.
            subNav.setAttribute('data-visible', true);
            expanderBtn.setAttribute('aria-expanded', true);
            _activeSubnavExpander = expanderBtn;

            if (mediaQuery.matches) {
                document.addEventListener('keydown', handleEscapeKey);
                document.addEventListener('click', handleOutsideClick);
            }
        } else {
            // Close target subnav.
            subNav.setAttribute('data-visible', false);
            expanderBtn.setAttribute('aria-expanded', false);
            _activeSubnavExpander = null;

            if (mediaQuery.matches) {
                document.removeEventListener('keydown', handleEscapeKey);
                document.removeEventListener('click', handleOutsideClick);
            }
        }
    }

    // Close all open subnav branches for this nav instance.
    function closeAllSubnavs() {
        const allOpenSubnavs = thisNav.querySelectorAll('[data-visible="true"]');
        allOpenSubnavs.forEach(openSubNav => {
            openSubNav.setAttribute('data-visible', false);
            const siblingExpander = openSubNav.previousElementSibling
                ? openSubNav.previousElementSibling.querySelector('.nav-expander')
                : null;
            if (siblingExpander) {
                siblingExpander.setAttribute('aria-expanded', false);
            }
        });

        // Remove desktop-only close listeners.
        document.removeEventListener('keydown', handleEscapeKey);
        document.removeEventListener('click', handleOutsideClick);
    }

    // Escape closes all desktop subnavs and restores focus to opener.
    function handleEscapeKey(event) {
        if (event.key === 'Escape') {
            closeAllSubnavs();
            if (_activeSubnavExpander) {
                _activeSubnavExpander.focus();
                _activeSubnavExpander = null;
            }
        }
    }

    // Clicking outside this nav closes open subnavs.
    function handleOutsideClick(event) {
        if (!thisNav.contains(event.target)) {
            closeAllSubnavs();
        }
    }

    // Mobile-only: auto-open current ancestor path for context.
    function openCurrentAncestors() {
        const ancestorItems = thisNav.querySelectorAll('li.current-menu-ancestor');
        ancestorItems.forEach(li => {
            const expanderBtn = li.querySelector('.nav-expander');
            const subNav = expanderBtn ? expanderBtn.parentElement.nextElementSibling : null;
            // Open only when an ancestor branch is currently collapsed.
            if (expanderBtn && subNav && subNav.getAttribute('data-visible') === 'false') {
                subNav.setAttribute('data-visible', true);
                expanderBtn.setAttribute('aria-expanded', true);
            }
        });
    }

    // ---------------------------------------------------------------------
    // Responsive mode wiring
    // ---------------------------------------------------------------------

    // On resize, reconcile branch state with active breakpoint mode.
    function handleResize() {
        // If nav is closed during resize, close nav-owned search to avoid desynced hidden modal state.
        if (!_menuIsOpen()) {
            _closeNavSearchDialog();
        }

        if (mediaQuery.matches) {
            // Desktop: reset to collapsed state.
            closeAllSubnavs();
        } else {
            // Mobile: expose current section path.
            openCurrentAncestors();
        }
    }

    // Listen for window resize with debounce
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 150);
    });

    // Initial check
    handleResize();

    // Keep aria-expanded accurate when submenu is shown by CSS :hover.
    function _handleItemMouseenter() {
        const expander = this.querySelector(':scope > .menu-item-wrapper > .nav-expander');
        if (expander) expander.setAttribute('aria-expanded', true);
    }

    function _handleItemMouseleave() {
        const expander = this.querySelector(':scope > .menu-item-wrapper > .nav-expander');
        const subNav = expander ? expander.parentElement.nextElementSibling : null;
        // Keep aria-expanded true if keyboard opened the submenu.
        if (expander && subNav && subNav.getAttribute('data-visible') !== 'true') {
            expander.setAttribute('aria-expanded', false);
        }
    }

    function _addHoverListeners() {
        topLevelItems.forEach(li => {
            li.addEventListener('mouseenter', _handleItemMouseenter);
            li.addEventListener('mouseleave', _handleItemMouseleave);
        });
    }

    function _removeHoverListeners() {
        topLevelItems.forEach(li => {
            li.removeEventListener('mouseenter', _handleItemMouseenter);
            li.removeEventListener('mouseleave', _handleItemMouseleave);
        });
    }

    // Apply proper listeners when crossing desktop/mobile breakpoint.
    function handleMediaQueryChange(e) {

        if (e.matches) {
            // Desktop: keyboard-only expander activation, plus hover aria sync.
            subnavExpanders.forEach(expander => {
                expander.removeEventListener('click', handleSubnavExpander);
                expander.addEventListener('keydown', handleSubnavExpander);
            });

            document.removeEventListener('keydown', _handleMobileEscape);
            _addHoverListeners();
        } else {
            // Mobile: support click and keyboard activation, no hover sync.
            subnavExpanders.forEach(expander => {
                expander.removeEventListener('keydown', handleSubnavExpander);
                expander.addEventListener('click', handleSubnavExpander);
                expander.addEventListener('keydown', handleSubnavExpander);
            });

            _removeHoverListeners();
        }
    }

    // Initial check for the media query
    handleMediaQueryChange(mediaQuery);

    // Listen for changes to the media query
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return this;
}
