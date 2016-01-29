<?php
/**
 * Template Name: Home
 * Author: Coby Tamayo
 */

// Get common/site-wide data
$data = $site->get_context_with_post( new Project\Page() );

// Render the default view
Timber::render( 'front-page.twig', $data );

?>