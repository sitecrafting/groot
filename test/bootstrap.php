<?php

require_once __DIR__ . '/../vendor/autoload.php';

/*
 * Define some WP constants that are referenced directly in Groot
 */
define('ABSPATH', realpath(__DIR__ . '/../'));
define('WP_PLUGIN_DIR', ABSPATH . '/wp/wp-content/plugins');
define('WPMU_PLUGIN_DIR', ABSPATH . '/wp/wp-content/plugins');

// Check for multisite mode
if (getenv('WP_MULTISITE')) {
    define('MULTISITE', true);
    define('SUBDOMAIN_INSTALL', false);
}

\WP_Mock::bootstrap();
