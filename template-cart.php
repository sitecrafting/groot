<?php
/**
 * Author: Leah Ruisenor
 * Template Name: Woocommerce Cart
 */

use Conifer\Post\Page;

// Get common/site-wide data
$data = $site->context(['post' => new Page()]);

Timber::render( 'cart.twig', $data );
