<?php
/**
 * Custom page class
 */

namespace Project;

/**
 * Class to represent WordPress pages.
 *
 * @copyright 2015 SiteCrafting, Inc.
 * @author Coby Tamayo
 * @package  Groot
 */
class Page extends Post {
	/**
	 * Get the top-level title to display from the nav structure, fall back
	 * on this Page object's title it it's outside the nav hierarchy.
	 * @param Project\Menu $menu the menu to look at to determine the title
	 * @return string the title to display
	 */
	public function get_title_from_nav_or_post( Menu $menu ) {
		return $menu->get_current_top_level_item( $this )
			?: $this->title;
	}

	/**
	 * Get the Blog Landing Page.
	 * @return  Project\Page
	 */
	public static function get_blog_page() {
		return new static( get_option('page_for_posts') );
	}
}

