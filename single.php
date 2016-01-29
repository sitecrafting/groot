<?php
/**
 * Author: Coby Tamayo
 */

$data = $site->get_context_with_post( new Project\Post() );

Timber::render( 'single.twig', $data );