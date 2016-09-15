<?php
/**
 * Declarative-style WP shortcodes
 */

namespace Shortcode;

/**
 * Easily add shortcodes by calling register() on a class that implements this
 * abstract class
 *
 * @copyright 2015 SiteCrafting, Inc.
 * @author Coby Tamayo
 * @package  Groot
 */
abstract class AbstractBase {
	/**
	 * Register a shortcode with the given "tag".
	 * Tells WP to call render() to render the shortcode content.
	 * @param  string $tag The tag to be used to write the actual shortcode
	 */
	public static function register( $tag ) {
		add_shortcode( $tag, [new static(), 'render'] );
	}


	abstract public function render( $atts = [] );
}

?>