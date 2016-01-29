<?php

/*
 *
 */

// Autoload classes
require_once 'autoload.php';
$loader = new Project\Autoloader();
$loader->register();

// Warn admin user if Timber is not installed/activated
if ( ! class_exists( 'Timber' ) ) {
	add_action( 'admin_notices', function() {
		echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="'
				. esc_url( admin_url( 'plugins.php#timber' ) )
				. '">'
				. esc_url( admin_url( 'plugins.php' ) )
			. '</a></p></div>';
	});
	return;
}

// Configure custom routes in a route file. Example:
// Timber::add_route( '/blog', function($params) {
// 	Timber::load_template( 'archive.php', $query );
// });
// require_once 'routes.php';

// Build out the site.
// Put WordPress configurations, such as filter and action hooks,
// inside the build method.
$site = new Project\Site();
$site->configure();

?>