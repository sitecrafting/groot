<?php
/**
 * Author: Coby Tamayo
 */

use Timber\Timber;
use Conifer\Post\BlogPost;

$data = $site->get_context_with_post(new BlogPost());

Timber::render( 'single.twig', $data );
