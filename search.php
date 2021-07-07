<?php
/**
 * Search results page
 */

use Timber\Timber;
use Conifer\Post\Post;

$data = $site->context(['posts' => Timber::get_posts()]);

global $wp_query;
$data['search_total'] = $wp_query->found_posts;

Timber::render( 'search.twig', $data );

?>
