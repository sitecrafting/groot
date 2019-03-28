<?php
/**
 * Search results page
 */

use Timber\Timber;
use Conifer\Post\Post;

$data = $site->get_context_with_posts( Post::get_all() );

Timber::render( 'search.twig', $data );

?>
