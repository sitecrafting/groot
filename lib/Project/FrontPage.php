<?php
/**
 * Home page class
 */

namespace Project;

/**
 * Class to represent the home page.
 *
 * @copyright 2015 SiteCrafting, Inc.
 * @author Coby Tamayo
 * @package  Groot
 */
class FrontPage extends Post {
	public static function get() {
		return new static( get_option('page_on_front') );
	}
}

