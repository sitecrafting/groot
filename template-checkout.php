<?php
/**
 * Author: Leah Ruisenor
 * Template Name: Woocommerce Checkout
 */

use Conifer\Post\Page;

// Get common/site-wide data
$data = $site->context(['post' => new Page()]);

Timber::render( 'checkout.twig', $data );
