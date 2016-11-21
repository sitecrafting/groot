<?php

/**
 * Define custom routes outside the WordPress template hierarchy.
 * These don't take effect by default; you must include it from your functions.php,
 * or elsewhere within your theme code.
 *
 * @copyright 2016 SiteCrafting, Inc.
 * @author Coby Tamayo
 * @package  Groot
 */

use Project\BlogPost;

/**
 * Route for getting blog post content via AJAX, e.g. for lazy-loading
 */
Routes::map('/blog-ajax/', function($params) {
  $query = BlogPost::build_query_params($_GET);
  Routes::load('blog-ajax.php', $params, $query, 200);
});
