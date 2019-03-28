<?php

use Groot\PluginManager;
use Conifer\Post\Image;
use Conifer\Site;


// autoload dependencies, if any
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
  require_once __DIR__ . '/vendor/autoload.php';
}

// autoload library files
spl_autoload_register(function(string $class) {
  $file = __DIR__ . '/lib/' . str_replace('\\', '/', $class) . '.php';
  if (file_exists($file)) {
    require $file;
  }
});


require_once 'util.php';

// Require that certain classes be loaded (presumably by plugins)
$pluginManager = new PluginManager();
$pluginManager->require_classes([
	'\Timber\Site',
	'\Conifer\Site',
	// add your own classes here
]);

// Check that all requirements have been met
if (!$pluginManager->requirements_met()) {
	// plugins haven't initialized properly; bail
	return;
}

// Build out the site.
// Put WordPress configurations, such as filter and action hooks,
// inside the config function passed to Site::configure().
$site = new Site();
$site->configure(function() {

  /*
   * @groot config_callback
   */

});


?>
