<?php
/**
 * Author: Coby Tamayo
 */

use Timber\Timber;
use Timber\User;

$authorId = $GLOBALS['wp_query']->query_vars['author'];
$user     = Timber::get_user($authorId);

// Get common/site-wide data
$data = Timber::context([
  // Treat author as "post" for navigation purposes
  'post'  => $user,
]);

// Render the archive view
Timber::render( 'index.twig', $data );
