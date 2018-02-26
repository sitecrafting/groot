<?php

use Groot\Autoloader;
use Groot\PluginManager;
use Conifer\Site;

require_once 'lib/Groot/Autoloader.php';
require_once 'util.php';

// Autoload plugin and theme library classes
$loader = new Autoloader();
$loader->register();

// Require that certain classes be loaded (presumably by plugins)
$pluginManager = new PluginManager();
$pluginManager->require_classes([
	'Timber\Timber',
	'Conifer\Site',
	// add your own classes here
]);

// Check that all requirements have been met
if (!$pluginManager->requirements_met()) {
	// plugins haven't initialized properly; bail
	return;
}

// Build out the site.
// Put WordPress configurations, such as filter and action hooks,
// inside the build method.
$site = new Site();
$site->configure();




?>
