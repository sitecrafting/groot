<?php

namespace Project;

/**
 * Basic Project-specific Autoloader with configurable search paths.
 *
 * @copyright 2015 SiteCrafting, Inc.
 * @author Coby Tamayo
 */
class Autoloader {
	protected $paths;

	public function __construct( array $paths = [] ) {
		// default to looking in the theme's lib/ dir
		$this->paths = $paths ?: [get_stylesheet_directory() . '/lib/'];
	}

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