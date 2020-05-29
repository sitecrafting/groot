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