<?php
/**
 * PSR-4 autoloading
 */

namespace Project;

/**
 * Basic Project-specific Autoloader with configurable search paths.
 *
 * @copyright 2015 SiteCrafting, Inc.
 * @author Coby Tamayo
 * @package  Groot
 */
class Autoloader {
	/**
	 * Directory paths to check when autoloading classes.
	 * @var array
	 */
	protected $paths;

	/**
	 * Constructor
	 * @param array $paths Directories to register. When searching for classes to autoload,
	 * the autoloader will check these directories in the order they are specified here.
	 */
	public function __construct( array $paths = [] ) {
		// default to looking in the theme's lib/ dir
		$this->paths = $paths ?: [get_stylesheet_directory() . '/lib/'];
	}

	/**
	 * Register this Autoloader's paths with spl_autoload_register
	 */
	public function register() {
		spl_autoload_register( function($namespacedClassName) {
			// Infer relative file path to
			// "Foo\Bar" to "Foo/Bar.php"
			$relativeFile = str_replace('\\', '/', $namespacedClassName) . '.php';

			foreach( $this->paths as $path ) {
				$file = $path . $relativeFile;

				if( file_exists($file) ) {
					require $file;
				}
			}
		});
	}
}

?>