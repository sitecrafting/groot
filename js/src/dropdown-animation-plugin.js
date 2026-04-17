/**
 * Dropdown Animation Plugin
 * 
 * Provides reusable functions for smoothly animating element open/close with height transitions.
 * 
 * Usage:
 * import { openDropdown, closeDropdown } from './dropdown-animation-plugin.js'
 * 
 * openDropdown(element)  // Animate element open
 * closeDropdown(element) // Animate element closed
 */

/**
 * Animate an element closed with a smooth height transition
 * 
 * @param {HTMLElement} elem - Element to close
 * @returns {void}
 */
export function closeDropdown(elem) {
    // Give the element a height to change from
    elem.style.height = elem.scrollHeight + 'px';
    elem.style.overflow = 'hidden';

    // Set the height back to 0
    window.setTimeout(function () {
        elem.style.height = '0';
    }, 1);

    // When the transition is complete, remove inline styles
    window.setTimeout(function () {
        elem.setAttribute('data-visible', false);
        elem.style.height = '';
        elem.style.overflow = '';
    }, 350);
}

/**
 * Animate an element open with a smooth height transition
 * 
 * @param {HTMLElement} elem - Element to open
 * @returns {void}
 */
export function openDropdown(elem) {
    // Get the natural height of the element
    // Even though we're showing and then re-hiding our content, it never shows visibly for users because 
    // the function runs so quickly (just a few milliseconds) and thus never actually renders visually in the DOM.
    elem.style.display = 'block'; // Make it visible
    const height = elem.scrollHeight + 'px'; // Get its height
    elem.style.display = ''; // Hide it again
    elem.setAttribute('data-visible', true);
    elem.style.height = height; // Set the height for animation
    elem.style.overflow = 'hidden';

    // Once the transition is complete, remove inline styles so content can scale responsively
    window.setTimeout(function () {
        elem.style.height = '';
        elem.style.overflow = '';
    }, 350);
}
