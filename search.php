<?php
/**
 * Search results page
 */

use Timber\Timber;
use Conifer\Post\Post;

global $wp_query;

//calculate: Showing 1-10 of 603
if ( !is_paged() ) {
    // first page of pagination
    $first_post = absint( $wp_query->get('paged') - 1 );
    $last_post = $first_post + $wp_query->post_count - 1;
    $all_posts = $wp_query->found_posts;
} else {
    $first_post = absint( $wp_query->get('paged') - 1 ) * $wp_query->get('posts_per_page') + 1;
    $last_post = $first_post + $wp_query->post_count - 1;
    $all_posts = $wp_query->found_posts;
} 

$enumerate_page = 'Showing '. $first_post .' - '. $last_post .' of ' . $all_posts;


$data = Timber::context([
    'posts' => Timber::get_posts(),
    'enumerate_page' => $enumerate_page,
    'search_total' => $wp_query->found_posts
]);

Timber::render( 'search.twig', $data );

?>
