<?php
/**
 * Author: Coby Tamayo
 */

use Timber\Timber;
use Conifer\Post\Post;

$data = $site->get_context_with_post( new Post() );

Timber::render( 'single.twig', $data );
