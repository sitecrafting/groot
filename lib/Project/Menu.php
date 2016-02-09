<?php

namespace Project;

/**
 * Custom Menu class to add special nav behavior on top of
 * TimberMenu instances.
 *
 * @copyright 2015 SiteCrafting, Inc.
 * @author Coby Tamayo
 */
class Menu extends \TimberMenu {
	public $MenuItemClass = '\Project\MenuItem';
	public $PostClass = '\Project\Post';

	/**
	 * Get the top-level nav item that points, or whose ancestor points,
	 * to the current post
	 * @return Project\MenuItem the current top-level MenuItem
	 */
	public function get_current_top_level_item() {
		foreach( $this->get_items as $item ) {
			if( $item->points_to_current_post_or_ancestor() ) {
				return $item;
			}
		}
	}
}

?>

