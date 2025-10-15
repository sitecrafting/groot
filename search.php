<?php
/**
 * Search results page
 */

use Timber\Timber;

global $wp_query;

$data = Timber::context([
    'posts' => Timber::get_posts(),
    'search_total' => $wp_query->found_posts
]);

Timber::render( 'search.twig', $data );

?>
