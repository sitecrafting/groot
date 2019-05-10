<?php
/**
 * Author: Coby Tamayo
 */

use Conifer\Post\Page;

// Get common/site-wide data
$data = $site->get_context_with_post( new Page() );

// Render the default view
Timber::render( 'page.twig', $data );
