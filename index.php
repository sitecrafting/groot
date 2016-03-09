<?php
/**
 * Author: Coby Tamayo
 */

use Project\Page;

// Get common/site-wide data
$data = $site->get_context_with_posts( Project\Post::get_all() );
$data['post'] = Page::get_blog_page();

// Render the archive view
Timber::render( 'index.twig', $data );