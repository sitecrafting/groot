<?php
/**
 * Author: Reena Hensley
 * Template Name: Landing
 */

use Timber\Timber;

// Get common/site-wide data
$data = $site->context([
  // As of Timber 2.0, `post` is already populated.
  // Specify additional stuff you want to merge in here.
]);

// Render the default view
Timber::render( 'template-landing.twig', $data );
