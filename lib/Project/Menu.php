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
}

?>

