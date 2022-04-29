<?php
/**
 * Author: Coby Tamayo
 */

use Timber\Archives;
use Timber\Timber;

use Conifer\Post\Page;
use Conifer\Post\BlogPost;


//blog page
$newsPage = Page::get_blog_page();

$featurePost = '';
$is_category = false;
$catQuery = '';

if( is_tag() || is_category() ) {

	// tag/category archive page
	$post = new TimberTerm();
	$is_category = true;

	$catQuery = get_query_var('cat');

} else {

	// regular blog archive
	$post = $newsPage;

}

//get archives
//This is not currently in a functioning state to be able to
//filter by archive date
//$archives = new Archives();

//TWIG
/*
<nav class="subnav-filter">
    <h3 class="subnav-filter__title">Archives</h3>
    <ul class="subnav-filter__menu">
        <li><a href="{{ get_blog_url() }}">All</a></li>
        {% for archive in archives.items %}
            {% for month in archive.children %}
                <li><a href="{{ month.link }}">{{ month.name }} {{ archive.name }}</a></li>
            % endfor %}
        {% endfor %}
    </ul>
</nav><!-- //subnav-filter -->
*/

//get pagination
$pagination = Timber::get_pagination();


// GET CONTEXT DATA
$data = $site->context([
	'newsPage' => $newsPage,
	'post' => $post,
	'is_category' => $is_category,
	'posts' => BlogPost::get_all([
		'category__in'	=> $catQuery, 
		'paged'			=> get_query_var('paged'),
	]),
	'pagination' => $pagination,
	//'archives' => $archives
]);

// Render the archive view
Timber::render( 'index.twig', $data );
