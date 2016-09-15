<?php
/**
 * Custom Twig functions for dealing with images
 */

namespace TwigWrapper\Functions;

use Timber;
use TimberImage;

/**
 * Twig Wrapper around high-level image functions
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
	public function get_functions() {
		return [
			'img_from_id' => function( $id, $size, $attibutes = [] ) {
				return Timber::compile('partials/shared/img.twig', [
					'image' => new TimberImage($id),
					'size'	=> $size,
				]);
			},
		];
	}
}
