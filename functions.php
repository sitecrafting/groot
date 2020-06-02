<?php

use Groot\PluginManager;
use Conifer\Post\Image;
use Conifer\Site;
use Conifer\Navigation\Menu;

use Project\Post\Page;
use Project\Twig\ThemeTwigHelper;


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

   $this->add_twig_helper(new ThemeTwigHelper());

  add_theme_support( 'post-thumbnails' );
  add_theme_support( 'menus' );

  //use editor-style.css for the admin center RTE
  add_editor_style();

  //add template name to admin center list view
  Page::add_admin_column('_wp_page_template', 'Template', function($id) {
    // get mapping of Template File => Template Name
    static $templates = null;
    $templates = $templates ?: array_flip(get_page_templates());

    // get the template file for this page
    $templateFile = get_post_meta($id, '_wp_page_template', true) ?: '';

    // return the template name for this page
    return $templates[$templateFile] ?? 'Default Template';
  });

    //remove read more tag
    add_filter( 'mce_buttons', 'sc_remove_tiny_mce_buttons_from_row1');
    function sc_remove_tiny_mce_buttons_from_row1( $buttons ) {
        $remove_buttons = array(
            'wp_more', // read more link
        );
        foreach ( $buttons as $button_key => $button_value ) {
            if ( in_array( $button_value, $remove_buttons ) ) {
                unset( $buttons[ $button_key ] );
            }
        }
        return $buttons;
    }
    //REMOVE TEXT COLOR OPTION FROM RTE
    add_filter( 'mce_buttons_2', 'sc_remove_tiny_mce_buttons_from_row2');
    function sc_remove_tiny_mce_buttons_from_row2( $buttons ) {
        $remove_buttons = array(
            'forecolor', // text color
        );
        foreach ( $buttons as $button_key => $button_value ) {
            if ( in_array( $button_value, $remove_buttons ) ) {
                unset( $buttons[ $button_key ] );
            }
        }
        return $buttons;
    }

  /*
   * Disable comments across the site
   */

  add_action('admin_init', function() {
    global $pagenow;

    if ($pagenow === 'edit-comments.php') {
      wp_redirect(admin_url());
      exit;
    }

    // Remove comments metabox from dashboard
    remove_meta_box('dashboard_recent_comments', 'dashboard', 'normal');

    // Disable support for comments and trackbacks in post types
    foreach (get_post_types() as $post_type) {
      if (post_type_supports($post_type, 'comments')) {
        remove_post_type_support($post_type, 'comments');
        remove_post_type_support($post_type, 'trackbacks');
      }
    }
  });

  // hide comment menu item from WP Dashboard menu
  add_action('admin_menu', function() {
    remove_menu_page('edit-comments.php');
  });

  // hide comment menu items in WP Admin bar
  add_action('wp_before_admin_bar_render', function() {
    global $wp_admin_bar;
    $wp_admin_bar->remove_menu('comments');
  });

  // hide comments column in WP Admin
  add_filter('manage_page_columns', function(array $columns) {
    unset($columns['comments']);
    return $columns;
  });

  // hide all existing comments
  add_filter('comments_array', '__return_empty_array', 10, 2);

  // Close comments on the frontend
  add_filter('comments_open', '__return_false', 20, 2);
  add_filter('pings_open', '__return_false', 20, 2);

  /* ^^^ end disable comment code ^^^ */


  add_action('wp_enqueue_scripts', function() {
    /*
     * Enqueue our own project-specific JavaScript, including dependencies.
     * If you need to add a script to be enqueued and it's ok to do so
     * site-wide, consider doing so via Grunt instead of here to reduce
     * page load times.
     */
    $this->enqueue_script(
      'project-common',
      'common.js',
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

    $this->enqueue_style('project-css', 'style.css', [], true);
    $this->enqueue_style('project-print-css', 'print.css', [], true, 'print');

  });

  // Add an ACF-driven options page
  if ( is_admin() && function_exists('acf_add_options_page') ) {
    acf_add_options_page([
      'page_title' => 'Theme Settings',
      'menu_slug' => 'theme-settings',
    ]);
  }

  
  

  // disable default Gallery
  add_filter( 'use_default_gallery_style', '__return_false' );

  // CUSTOM IMAGE CROPS
  add_image_size( 'gallery', 900, 600, true ); //gallery slideshow flex pattern
  add_image_size( 'article-card', 380, 250, true ); //article-card partial

  // Make certain custom sizes available in the RTE
  // use this to unset or add image size options for RTE insert
  /*add_filter( 'image_size_names_choose', function($sizes) {

    //USE THIS TO UNSET DEFAULT VARIABLE SIZES AND SET YOUR OWN CUSOM SIZES
    //unset( $sizes['large'] );
    //unset( $sizes['medium'] );
    //unset( $sizes['small'] );

    return array_merge( $sizes, [
      'image-row-small'  => __( 'Small 300x235' ),
      'image-row-medium' => __( 'Medium 450x350' ),
      'image-row-large'  => __( 'Large 900x450' )
    ]);
  });*/

  // register common nav menus
  register_nav_menus([
    'primary' => 'Main Navigation', // main page/nav structure
    'utility'  => 'Utility Navigation',
  ]);

  add_filter('timber_context', function(array $context) : array {

    $context['primary_menu']     = new Menu('primary');
    $context['utility_menu']      = new Menu('utility');

    return $context;
  });


  /**
   * Add Woocommerce support to the theme
   * Source: https://timber.github.io/docs/guides/woocommerce/
   * 
   * Additionally, declaring what sizes (widths) should be used.
   * Note: admin users will not be able to change these sizes.
   * Source: https://docs.woocommerce.com/document/image-sizes-theme-developers/
   * 
   * Add theme support for single product gallery slideshow on product detail page
   */
  function theme_add_woocommerce_support() {
    add_theme_support( 'woocommerce', array(
      'thumbnail_image_width' => 400,
      'gallery_thumbnail_image_width' => 100,
      'single_image_width' => 500,
    ) );
    add_theme_support( 'wc-product-gallery-zoom' );
    add_theme_support( 'wc-product-gallery-lightbox' );
    add_theme_support( 'wc-product-gallery-slider' );
  }
  add_action( 'after_setup_theme', 'theme_add_woocommerce_support' );

  /** Fix for products in the loop that do not get the right context by default. */
  function timber_set_product( $currPost ) {
    global $post, $product;
    if ( is_woocommerce() ) {
      $product = wc_get_product($currPost->ID);
      $post = get_post($currPost->ID);
    }
  }

  /** Woo Product Categories */
  register_sidebar([
    'name' => 'Woo Product Categories',
    'id' => 'woo-product-categories'
  ]);
  
  /** Woocommerce customized filters and hooks */
  require_once(get_template_directory().'/functions/woocommerce-shop.php');

  /*
   * Hide plugins that come with the custom SiteCrafting/WordPress upstream
   * https://bitbucket.org/sitecrafting/wordpress/src
   *
   * NOTE: when you do this, you should also make sure the following is in
   * your /pantheon.yml file:
   *
   * ```
   * protected_web_paths:
   *   - /wp-content/plugins/the-events-calendar/
   *   - /wp-content/plugins/events-calendar-pro/
   *   # ...any other protected web paths you like here...
   * ```
   */

  /*add_action('pre_current_active_plugins', function() {
    global $wp_list_table;

    unset($wp_list_table->items['the-events-calendar/the-events-calendar.php']);
    unset($wp_list_table->items['events-calendar-pro/events-calendar-pro.php']);
  });*/

});


?>
