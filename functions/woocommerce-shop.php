<?php

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
    'name' => 'Woocommerce Sidebar',
    'id' => 'woocommerce-sidebar'
  ]);


/*=====================
 * File for Woocommerce filters and hooks
 ====================*/

/**
 * Change number of products that are displayed per page (shop page)
 * Source: https://docs.woocommerce.com/document/change-number-of-products-displayed-per-page/
 * 
 * Return the number of products you want to show per page.
 */
add_filter( 'loop_shop_per_page', 'new_loop_shop_per_page', 20 );
function new_loop_shop_per_page( $cols ) {
  // $cols contains the current number of products per page based on the value stored on Options -> Reading
  $cols = 12;
  return $cols;
}

/**
 * Woocommerce has a default message that it shows if you tick the box but don’t type any message. 
 * This filter changes that default message
 * 
 * Display a Store Notice (Optional)
 * To show customers a site-wide Store Notice:
 * Go to: Appearance > Customize > WooCommerce > Store Notice:
 */
//add_filter( 'woocommerce_demo_store', 'wc_custom_store_notice_updated' );
function wc_custom_store_notice_updated( $text ) {
	return str_replace( 'This is a demo store for testing purposes &mdash; no orders shall be fulfilled.', '<a href="/shop/">Check out our items.</a>', $text );
}

/**
 * Adding a custom location rule for ACF Woocommerce Shop page 
 * This filter adds a location to ACF location rule section.
 * 
 * Page Type -> WooCommerce Shop Page
 * 
 * Source: https://www.advancedcustomfields.com/resources/custom-location-rules/
 */
add_filter( 'acf/location/rule_values/page_type', function ( $choices ) {
  $choices['woo_shop_page'] = 'WooCommerce Shop Page';
  return $choices;
});

add_filter( 'acf/location/rule_match/page_type', function ( $match, $rule, $options ) {
  if ( $rule['value'] == 'woo_shop_page' && isset( $options['post_id']) ) {
      if ( $rule['operator'] == '==' )
          $match = ( $options['post_id'] == wc_get_page_id( 'shop' ) );
      if ( $rule['operator'] == '!=' )
          $match = ( $options['post_id'] != wc_get_page_id( 'shop' ) );
  }
  return $match;
}, 10, 3 );

/* remove default related products */
remove_action( 'woocommerce_after_single_product_summary', 'woocommerce_output_related_products', 20 );

/**
 * Remove Woocommerce Select2 - Woocommerce 3.2.1+
 */
function woo_dequeue_select2() {
    if ( class_exists( 'woocommerce' ) ) {
        wp_dequeue_style( 'select2' );
        wp_deregister_style( 'select2' );

        wp_dequeue_script( 'selectWoo');
        wp_deregister_script('selectWoo');
    } 
}
add_action( 'wp_enqueue_scripts', 'woo_dequeue_select2', 100 );