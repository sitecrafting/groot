<?php
/**
 * Author: Coby Tamayo
 */

// Get common/site-wide data
$data = $site->get_context_with_posts( Project\Post::get_all() );

// Treat author as "post" for navigation purposes
$data['post'] = new TimberUser( $GLOBALS['wp_query']->query_vars['author'] );

// Render the archive view
Timber::render( 'index.twig', $data );
