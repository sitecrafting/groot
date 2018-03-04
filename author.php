<?php
/**
 * Author: Coby Tamayo
 */

use Timber\Timber;
use Timber\User;
use Conifer\Post\Post;

// Get common/site-wide data
$data = $site->get_context_with_posts( Post::get_all() );

// Treat author as "post" for navigation purposes
$data['post'] = new User( $GLOBALS['wp_query']->query_vars['author'] );

// Render the archive view
Timber::render( 'index.twig', $data );
