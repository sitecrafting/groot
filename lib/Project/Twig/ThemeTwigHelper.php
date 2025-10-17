<?php

/**
 * Project\Twig\TwigHelper class
 *
 * @copyright 2019 SiteCrafting, Inc.
 */

namespace Project\Twig;

use Timber\Timber;
use Timber\Term;
use Conifer\Twig\HelperInterface;

/**
 * A place to put your custom Twig functions and filters.
 *
 * To add these automatically, add this to your config callback:
 *
 * ```
 * $this->add_twig_helper(new ThemeTwigHelper);
 * ```
 *
 * @see https://coniferplug.in/reference/twig-helperinterface.html
 */
class ThemeTwigHelper implements HelperInterface {
  public function get_functions() : array {
    // add your project-specific Twig functions here
    return [
        'gtm4wp_the_gtm_tag' => [$this, 'gtm4wp_the_gtm_tag'],
        'get_posts_pattern' => [$this, 'get_posts_pattern'],
        'get_related_posts' => [$this, 'get_related_posts'],
    ];
  }

  public function get_filters() : array {
    // add you project-specific Twig filters here
    return [];
  }


  public function gtm4wp_the_gtm_tag(){
      if ( function_exists( 'gtm4wp_the_gtm_tag' ) ) {
          return gtm4wp_the_gtm_tag();
      }
      else{
          return false;
      }
  }

  public function get_related_posts($post, $postCount = 3){

    return $post->get_related_by_category($postCount);
  }

  public function get_posts_pattern($post_type, $count, $taxonomy, $taxonomy_id ){

    $taxQuery = '';

    if( !empty($taxonomy) && !empty($taxonomy_id) ){
      $taxQuery = array(
        'taxonomy' => $taxonomy,
        'terms' => $taxonomy_id
      );
    }

    $posts = Timber::get_posts([
              'post_type' => $post_type,
              'posts_per_page' => $count,
              'tax_query' => array(
                  'relation' => 'AND',
                  $taxQuery
              ),
            ]);

    return $posts;

  }

}
