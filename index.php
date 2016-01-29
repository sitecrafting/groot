<?php
/**
 * Author: Coby Tamayo
 */

// Get common/site-wide data
$data = $site->get_context_with_posts( Project\Post::get_all() );

// Render the archive view
Timber::render( 'index.twig', $data );