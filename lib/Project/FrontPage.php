<?php
/**
 * Home page class
 */

namespace Conifer;

/**
 * Class to represent the home page.
 *
 * @package Conifer
 */
class FrontPage extends Post {
  /**
   * Get the FrontPage instance.
   * @return \Project\FrontPage a FrontPage object
   */
	public static function get() {
		return new static( get_option('page_on_front') );
	}
}

