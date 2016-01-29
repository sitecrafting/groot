<?php

namespace Project;

/**
 * Custom MenuItem class for adding special nav behavior to
 * TimberMenuItem instances
 *
 * @copyright 2015 SiteCrafting, Inc.
 * @author Coby Tamayo
 */
class MenuItem extends \TimberMenuItem {
	const CLASS_HAS_CHILDREN 			= 'menu-item-has-children';
	const CLASS_CURRENT 					= 'current-menu-item';
	const CLASS_CURRENT_ANCESTOR 	= 'current-menu-ancestor';

	public $PostClass = '\Project\Post';

	/**
	 * Whether to display this item's children. Typically for use in
	 * side navigation structures with lots of hierarchy.
	 * @return boolean true if this Item has nav children AND
	 * represents the current page or an ancestor of the current page
	 */
	public function display_children() {
		$indicatorClasses = [
			static::CLASS_HAS_CHILDREN,
			static::CLASS_CURRENT,
			static::CLASS_CURRENT_ANCESTOR,
		];

		// If one or more "indicator" classes have been applied to
		// this MenuItem, show its children
		return count(
			array_intersect( $this->classes, $indicatorClasses )
		) >= 1;
	}
}

?>

