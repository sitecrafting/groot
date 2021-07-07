<?php
/**
 * Author: Coby Tamayo
 */

use Timber\Timber;
use Conifer\Post\BlogPost;

$post = new BlogPost();

$data = $site->context([
	'post' => $post,
	'related' => $post->get_related(3)
]);

Timber::render( 'single.twig', $data );
