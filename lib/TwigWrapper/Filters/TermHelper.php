<?php

namespace TwigWrapper\Filters;

use TimberTerm;
use TimberCoreInterface;

/**
 * Twig Wrapper around filters for WP/Timber terms and taxonomies
 */
class TermHelper extends AbstractBase {
	/**
	 * Get the Twig functions to register
	 * @return  array an associative array of callback functions, keyed by name
	 */
	public function get_filters() {
		return [
			'term_item_class' => [$this, 'term_item_class'],
		];
	}

	/**
	 * Filters the given term into a class for an <li>; considers $term "current" if
	 * $currentPostOrArchive is a TimberTerm instance (meaning we're on an archive page
	 * for that term), and it represents the same term as $term.
	 * @param  TimberTerm $term the term for the <li> currently being rendered
	 * @param  TimberCoreInterface $currentPostOrArchive the post or term representing
	 * the current archive page (e.g. a category listing)
	 * @return string the formatted phone number
	 */
	public function term_item_class( TimberTerm $term, TimberCoreInterface $currentPostOrArchive ) {
    // If $postOrArchive is a TimberTerm instance, we're on an archive page for that term.
    // In that case, compare it to $term to get the class(es) for the <li> being rendered
    $currentTermItem = ($currentPostOrArchive instanceof TimberTerm)
    										&& $term->ID === $currentPostOrArchive->ID;

    return $currentTermItem
        ? 'current-menu-item'
        : '';
	}
}