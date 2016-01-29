<?php
/**
 * Search results page
 */

$data = $site->get_context_with_posts( Project\Post::get_all() );

Timber::render( 'search.twig', $data );

?>