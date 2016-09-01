<?php
/**
 * Author: Coby Tamayo
 */

use Timber\Timber;
use Project\Page;

// Get common/site-wide data
$data = $site->get_context_with_posts( Project\Post::get_all() );

if( is_tag() || is_category() ) {
  // tag/category archive page
  $data['post'] = new TimberTerm();
} else {
  // regular blog archive
  $data['post'] = Page::get_blog_page();
}

// Render the archive view
Timber::render( 'index.twig', $data );
