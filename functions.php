<?php

// TODO use vendor/autoload.php
use Groot\Autoloader;
use Groot\PluginManager;
use Conifer\Post\Image;
use Conifer\Site;

require_once 'lib/Groot/Autoloader.php';
require_once 'util.php';

// Autoload plugin and theme library classes
$loader = new Autoloader();
$loader->register();

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

  add_theme_support( 'post-thumbnails' );
  add_theme_support( 'menus' );

  add_action('wp_enqueue_scripts', function() {
    /*
     * Enqueue our own project-specific JavaScript, including dependencies.
     * If you need to add a script to be enqueued and it's ok to do so
     * site-wide, consider doing so via Grunt instead of here to reduce
     * page load times.
     */
    $this->enqueue_script(
      'project-common',
      'dist/common.min.js',
      ['jquery']
    );

    //modernizr
    $this->enqueue_script(
      'project-modernizr',
      'modernizr/modernizr.custom.53630.js',
      [],
      true,
      false
    );

    /*
		 * NOTE: If you do need to enqueue additional scripts here,
     * it's probably best to enqueue them in the footer unless
     * there's a very good reason not to.
     */

    $this->enqueue_style(
      'project-css',
      'style.css',
      $dependencies = [],
      $version      = $this->get_assets_version()
    );
    $this->enqueue_style(
      'project-print-css',
      'print.css',
      $dependencies = [],
      $version      = $this->get_assets_version(),
      'print'
    );

  });

	// Add an ACF-driven options page
	if ( is_admin() && function_exists('acf_add_options_page') ) {
		acf_add_options_page([
			'page_title' => 'Theme Settings',
			'menu_slug' => 'theme-settings',
		]);
	}

  // used for Gallery ACF layout option in flexible content
  Image::add_size( 'gallery', 900, 600, true );

  //USED FOR Image-Row ACF layout option in flexible content
  Image::add_size( 'image-row-small', 300, 235, true );
  Image::add_size( 'image-row-medium', 450, 350, true );
  Image::add_size( 'image-row-large', 900, 450, true );

  // Make certain custom sizes available in the RTE
  // use this to unset or add image size options for RTE insert
  /*add_filter( 'image_size_names_choose', function($sizes) {

    //USE THIS TO UNSET DEFAULT VARIABLE SIZES AND SET YOUR OWN CUSOM SIZES
    //unset( $sizes['large'] );
    //unset( $sizes['medium'] );
    //unset( $sizes['small'] );

    return array_merge( $sizes, [
      'image-row-small' => __( 'Small 300x235' ),
      'image-row-medium' => __( 'Medium 450x350' ),
      'image-row-large' => __( 'Large 900x450' )
    ]);
  });*/

  //remove_shortcode( 'gallery' );
  //Gallery::register( 'gallery' );
  add_filter( 'use_default_gallery_style', '__return_false' );

  // register common nav menus
  register_nav_menus([
    'primary' => 'Main Navigation', // main page/nav structure
    'global' => 'Global Navigation', // for stuff like social icons
    'footer' => 'Footer Navigation', // footer links
  ]);

  //blog sidebar
  register_sidebar([
    'name' => 'Blog Filter Bar',
    'id' => 'blog-filters',
    'before_widget' => '<div id="%1$s" class="filter %2$s">',
    'after_widget'  => "</div>\n",
    'before_title'  => '<h3 class="filtertitle">',
    'after_title'   => "</h3>\n"
  ]);
});


?>
