<?php
/**
 * Search results page
 */

use Timber\Timber;
use Conifer\Post\Post;

$data = $site->context([
  'posts' => Post::get_all(),
]);

Timber::render( 'search.twig', $data );

?>
