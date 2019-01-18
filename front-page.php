<?php
/**
 * Template Name: Home
 * Author: Coby Tamayo
 */

use Conifer\Post\FrontPage;

// Get common/site-wide data
$data = $site->get_context_with_post( new FrontPage() );

// Render the default view
Timber::render( 'front-page.twig', $data );

?>
