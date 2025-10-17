<?php
/**
 * Template Name: Home
 */

use Timber\Timber;

// Get common/site-wide data
$data = Timber::context();

// Render the default view
Timber::render( 'front-page.twig', $data );

?>
