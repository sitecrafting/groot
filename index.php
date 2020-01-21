<?php
/**
 * Author: Coby Tamayo
 */

use Timber\Archives;
use Timber\Timber;

use Conifer\Post\Page;
use Conifer\Post\BlogPost;

// Get common/site-wide data
$data = $site->context([
  'posts' => BlogPost::get_all([
    'paged'        => get_query_var('paged'),
    'category__in' => [get_query_var('cat')],
  ]),
]);


if( is_tag() || is_category() ) {
  // tag/category archive page
  $data['post'] = new TimberTerm();
  $data['is_category'] = true;
} else {
  // regular blog archive
  $data['post'] = Page::get_blog_page();
}

//get archives
$data['archives'] = new Archives();

//blog page
$data['newsPage'] = Page::get_blog_page();

//get pagination
$data['pagination'] = Timber::get_pagination();

// Render the archive view
Timber::render( 'index.twig', $data );
