<?php
/**
 * Author: Coby Tamayo
 */

use Conifer\Post\Page;

// Get common/site-wide data
$data = $site->context(['post' => new Page()]);

// Render the default view
Timber::render( 'page.twig', $data );
