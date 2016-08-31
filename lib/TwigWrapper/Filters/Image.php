<?php
/**
 * Custom Twig filters for dealing with images
 */

namespace TwigWrapper\Filters;

use Timber;
use TimberImage;

/**
 * Twig Wrapper around high-level image filters
 *
 * @copyright 2015 SiteCrafting, Inc.
 * @author Coby Tamayo
 * @package  Groot
 */
class Image extends AbstractBase {
	/**
	 * Get the Twig functions to register
	 * @return  array an associative array of callback functions, keyed by name
	 */
	public function get_filters() {
		return [
			'src_to_retina' => function( $src ) {
				return preg_replace('~(\.[a-z]+)$~i', '@2x$1', $src);
			},
		];
	}
}
