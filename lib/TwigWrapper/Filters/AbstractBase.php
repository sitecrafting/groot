<?php
/**
 * Abstract base class for declarative, OO Twig functions
 */

namespace TwigWrapper\Filters;

/**
 * Easily define custom filters to add to Twig by extending this class.
 * Then just call YourCustomFilterClass::add_twig_filters( $site );
 *
 * @copyright 2015 SiteCrafting, Inc.
 * @author Coby Tamayo
 * @package  Groot
 */
abstract class AbstractBase {
	protected $site;

	/**
	 * Constructor
	 * @param \Project\Site $site the Site object
	 */
	public function __construct( \Project\Site $site ) {
		$this->site = $site;
	}

	/**
	 * Register the Twig filters this class defines in get_filters()
	 * on the central Site object
	 * @param type \Project\Site $site the Site object to register filters on
	 */
	public static function add_twig_filters( \Project\Site $site ) {
		$wrapper = new static( $site );
		foreach( $wrapper->get_filters() as $name => $closure ) {
			$site->add_twig_filter( $name, $closure );
		}
	}

	/**
	 * Must return an array of filters
	 * @return array an associative array of callables, keyed by the filter name
	 */
	abstract public function get_filters();
}