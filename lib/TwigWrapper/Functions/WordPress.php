<?php
/**
 * General-purpose WordPress functions in Twig
 */

namespace TwigWrapper\Functions;

use Timber\Timber;

/**
 * Twig Wrapper around generic or global functions, such as WordPress
 * template tags.
 *
 * @copyright 2015 SiteCrafting, Inc.
 * @author Coby Tamayo
 * @package  Groot
 */
class WordPress extends AbstractBase {
	/**
	 * Get the Twig functions to register
	 * @return  array an associative array of callback functions, keyed by name
	 */
	public function get_functions() {
		return [
			'get_search_form' => function() {
				return get_search_form( false );
			},
			'get_blog_url' => [ '\Project\Post', 'get_blog_url' ],
			'img_url' => function( $file ) {
				return get_stylesheet_directory_uri() . '/img/' . $file;
			},
			'wp_nav_menu' => function( $args ) {
				ob_start();
				wp_nav_menu( $args );
				return ob_get_clean();
			},
			'get_terms' => function( $taxonomy, $opts = ['hide_empty' => true] ) {
				return Timber::get_terms($taxonomy, $opts);
			},
			'paginate_links' => function( $args = [] ) {
				return paginate_links($args);
			},
			/**
			 * Twig function for getting a global WP option
			 */
			'get_option' => function($name) {
				return get_option($name);
			},
			/**
			 * Like get_option, but applies ACF filters, e.g. if need to return an object. Only works with ACF-configured option fields.
			 */
			'get_theme_setting' => function($name) {
				return get_field($name, 'option');
			},
			'get_sidebar_widgets' => function($name) {
				return Timber::get_widgets($name);
			},
			'get_latest_posts' => function($num = 3){
				return Timber::get_posts( array('post_type' => 'post', 'posts_per_page' => $num) );
			}
		];
	}
}
