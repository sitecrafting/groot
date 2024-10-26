<?php
/**
 * Author: Coby Tamayo
 */

use Timber\Timber;

// Get common/site-wide data
$data = Timber::context([
  // As of Timber 2.0, `post` is already populated.
  // Specify additional stuff you want to merge in here.
]);

// Render the default view
Timber::render( 'page.twig', $data );
