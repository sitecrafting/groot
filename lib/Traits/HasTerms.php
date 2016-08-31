<?php
/**
 * Retrieve tags and categories from posts
 */

namespace Traits;

/**
 * Trait that can be used from any post type class to get
 * tags and categories.
 *
 * @copyright 2015 SiteCrafting, Inc.
 * @author Coby Tamayo
 * @package  Groot
 */
trait HasTerms {
	/**
	 * Get the tags for this Post
	 * @return array an array of TimberTerm objects
	 */
	public function get_tags() {
		return $this->get_terms('tag');
	}

	/**
	 * Get the categories for this Post
	 * @return array an array of TimberTerm objects
	 */
	public function get_categories() {
		return $this->get_terms('category');
	}
}

