<?php
use Timber\Timber;

use Conifer\Post\Page;

//blog page
$newsPage = Page::get_blog_page();

$featurePost = '';
$is_category = false;
$catQuery = '';

if( is_tag() || is_category() ) {

	// tag/category archive page
	$post = Timber::get_term();
	$is_category = true;

	$catQuery = get_query_var('cat');

} else {

	// regular blog archive
	$post = $newsPage;

}

// GET CONTEXT DATA
$data = Timber::context([
	'newsPage' => $newsPage,
	'post' => $post,
	'is_category' => $is_category,
	'posts' => Timber::get_posts([
		'category__in'	=> $catQuery, 
		'paged'			=> get_query_var('paged'),
	]),
	//'archives' => $archives
]);

// Render the archive view
Timber::render( 'index.twig', $data );
