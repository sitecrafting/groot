<?php
/**
 * Author: Coby Tamayo
 */

use Timber\Timber;
use Conifer\Post\BlogPost;

$data = $site->context([
  'post' => new BlogPost(),
]);

Timber::render( 'single.twig', $data );
