<?php

namespace Project;

/**
 * Override
 *
 * @copyright 2015 SiteCrafting, Inc.
 * @author Coby Tamayo
 */
class Post extends \TimberPost {
	use \Traits\HasTerms;

	protected static $BLOG_URL;

	public static function get_all( $query = false ) {
		return \Timber::get_posts( $query, __CLASS__ );
	}

	/**
	 * Get the URL of the blog landing page
	 * (what WP calls the "post archive" page)
	 * @return string the URL
	 */
	public static function get_blog_url() {
		if( ! static::$BLOG_URL ) {
			// haven't fetched the URL yet...go get it
			$page = Page::get_blog_page();

			// cache it
			static::$BLOG_URL = $page->link();
		}

		return static::$BLOG_URL;
	}

	/**
	 * Check whether a post by the given ID exists
	 * @param  int $id the post ID to check for
	 * @return boolean     true if the post exists, false otherwise
	 */
	public static function exists( $id ) {
		return is_string( get_post_status( $id ) );
	}

	// your project-specific Post code here
}

