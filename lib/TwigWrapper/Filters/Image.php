<?php

namespace TwigWrapper\Filters;

use Timber;
use TimberImage;

/**
 * Twig Wrapper around high-level image filters
 * @package default
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
