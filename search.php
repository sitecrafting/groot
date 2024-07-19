<?php
/**
 * Search results page
 */

use Timber\Timber;
use Conifer\Post\Post;

global $wp_query;

$data = $site->context([
    'posts' => Timber::get_posts(),
    'search_total' => $wp_query->found_posts
]);

Timber::render( 'search.twig', $data );

?>
