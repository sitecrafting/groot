<?php
/**
 * Template Name: Home
 * Author: Coby Tamayo
 */

use Timber\Timber;

use Conifer\Post\FrontPage;

// Get common/site-wide data
$data = $site->context(['post' => new FrontPage()]);

// Render the default view
Timber::render( 'front-page.twig', $data );

?>
