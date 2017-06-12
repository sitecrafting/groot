<?php

use Timber\Timber;

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

// Build out the site.
// Put WordPress configurations, such as filter and action hooks,
// inside the build method.
$site = new Project\Site();
$site->configure();


/**
 * Log stuff to wp-content/debug.log, with a prefix so you can pipe
 * to a grep to filter out irrelevant log entries.
 * Assumes you have WP debugging configured like so in wp-config.php:
 *  define('WP_DEBUG',              true);
 *  define('WP_DEBUG_DISPLAY',      false);
 *  define('WP_DEBUG_LOG',          true);
 * @param  mixed $message the message or other value to log. If not a string, gets var_export'ed
 */
function debug($message) {
  if(!is_string($message)) {
    $message = var_export($message,true);
  }

  // break up message by line and prefix each one
  error_log( implode("\n", array_map(function($line) {
    return "debug $line";
  }, explode("\n", $message))));
}

/**
 * Variadic (sprintf() style) version of debug(). Calls sprintf() internally.
 */
function sdebug() {
  debug(call_user_func_array('sprintf', func_get_args()));
}


?>
