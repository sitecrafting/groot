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
    Page::add_admin_column('_wp_page_template', 'Template');

    /*
    * Disable comments across the site
    */
    $this->disable_comments();

    //remove quick post from dashboard
    function remove_dashboard_widgets() {
        global $wp_meta_boxes;
        unset($wp_meta_boxes['dashboard']['side']['core']['dashboard_quick_press']);
    }
    add_action('wp_dashboard_setup', 'remove_dashboard_widgets');

    add_action('wp_enqueue_scripts', function() {
        //Enqueue our own project-specific JavaScript, including dependencies.
        $this->enqueue_script(
            'project-common',
            'common.js',
            ['jquery'],
            ['file' => 'scripts.version']
        );
        
        $this->enqueue_style('project-css', 'style.css', [], ['file' => 'styles.version']);
        $this->enqueue_style('project-print-css', 'print.css', [], ['file' => 'styles.version'], 'print');

        wp_dequeue_style( 'wp-block-library' ); //remove block library wp css
        wp_dequeue_style('gform_theme_ie11'); //remove ie11 support for gravity forms

    });

    //remove unneccesary additional emoji scripts
    remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
    remove_action( 'wp_print_styles', 'print_emoji_styles' );

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
    add_image_size( 'gallery', 950, 600, true ); //gallery slideshow flex pattern
    add_image_size( 'article-card', 380, 250, true ); //article-card partial
    add_image_size( 'article-list-card', 276, 200, true ); //article-card partial

    // use this to unset or add image size options for RTE image insert
    /*add_filter( 'image_size_names_choose', function($sizes) {

        //USE THIS TO UNSET DEFAULT VARIABLE SIZES AND SET YOUR OWN CUSOM SIZES
        //unset( $sizes['large'] );
        //unset( $sizes['medium'] );
        //unset( $sizes['small'] );

        return array_merge( $sizes, [
            'custom-size'  => __( 'Custom 300x235' )
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

    /* ADDITIONAL UTILITIES/CUSTOMIZATIONS FOR THEME */
    
    //hide posts from admin menu
    // add_action('admin_menu', function(){
    //     remove_menu_page('edit.php');
    // });

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

    /** CROP THUMBNAILS PLUGIN - RETINA SUPPORT **/
    /**
 * 
 * Action for Crop Thumbnails plugin
 * Uses input crop data to generate retina size
 * 
 */
function add_retina_for_cropped_thumbnails( $input, $croppedSize, $temporaryCopyFile, $currentFilePath ) {

    $temporaryCopyFile = generate_retina_filename( $temporaryCopyFile, '@2x' );
    $retina_file = generate_retina_filename( $currentFilePath, '@2x' );

    $currentFilePathInfo = pathinfo($retina_file);
    $currentFilePathInfo['basename'] = wp_basename($retina_file);//uses the i18n version of the file-basename
    
    $retina_w = $croppedSize['width'] * 2;
    $retina_h = $croppedSize['height'] * 2;
    
    $cropped = wp_crop_image(						    // * @return string|WP_Error|false New filepath on success, WP_Error or false on failure.
        $input->sourceImageId,							// * @param string|int $src The source file or Attachment ID.
        $input->selection->x,							// * @param int $src_x The start x position to crop from.
        $input->selection->y,							// * @param int $src_y The start y position to crop from.
        $input->selection->x2 - $input->selection->x,	// * @param int $src_w The width to crop.
        $input->selection->y2 - $input->selection->y,	// * @param int $src_h The height to crop.
        $retina_w,							            // * @param int $dst_w The destination width.
        $retina_h,							            // * @param int $dst_h The destination height.
        false,											// * @param int $src_abs Optional. If the source crop points are absolute.
        $temporaryCopyFile								// * @param string $dst_file Optional. The destination file to write to.
    );
    
    // delete old file
    $should_delete = apply_filters('crop_thumbnails_should_delete_old_file',
        false, // default value
        $input->activeImageSizes->name,
        $input->activeImageSizes,
        $cropped
    );

    $_error = false;
    if( !empty($cropped) ) {
        if( $should_delete ) {
            @unlink($currentFilePathInfo['dirname'].DIRECTORY_SEPARATOR.$currentFilePathInfo['basename']);
        }
        if(!@copy($cropped, $retina_file)) {
            $_error = true;
        }
        if(!@unlink($cropped)) {
            $_error = true;
        }
    }    
}
add_action( 'crop_thumbnails_before_crop', 'add_retina_for_cropped_thumbnails', 10, 4 );

function generate_retina_filename( $file, $suffix ) {
    $dir = pathinfo( $file, PATHINFO_DIRNAME );
    $ext = pathinfo( $file, PATHINFO_EXTENSION );
 
    $name    = wp_basename( $file, ".$ext" );
    $new_ext = strtolower( $extension ? $extension : $ext );
 
    if ( ! is_null( $dest_path ) ) {
        $_dest_path = realpath( $dest_path );
        if ( $_dest_path ) {
            $dir = $_dest_path;
        }
    }
 
    return trailingslashit( $dir ) . "{$name}{$suffix}.{$new_ext}";
}
/** END CROP THUMBNAILS PLUGIN - RETINA SUPPORT */

});


?>
