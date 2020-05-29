<?php
/**
 * File for Woocommerce filters and hooks
 */

/**
 * Change number of products that are displayed per page (shop page)
 * Source: https://docs.woocommerce.com/document/change-number-of-products-displayed-per-page/
 * 
 * Return the number of products you wanna show per page.
 */
add_filter( 'loop_shop_per_page', 'new_loop_shop_per_page', 20 );
function new_loop_shop_per_page( $cols ) {
  // $cols contains the current number of products per page based on the value stored on Options -> Reading
  $cols = 4;
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