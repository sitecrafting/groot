<?php

namespace Traits;

/**
 * Trait that can be used from any post type class to get
 * tags and categories.
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

