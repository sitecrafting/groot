<?php

if ( ! class_exists( 'Timber' ) ) {
    echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';
    return;
}

$context            = Timber::context();
$context['sidebar'] = Timber::get_widgets( 'shop-sidebar' );

/* SINGLE PRODUCT VIEW */
if ( is_singular( 'product' ) ) {
    $context['post']    = Timber::get_post();
    $product            = wc_get_product( $context['post']->ID );
    $context['product'] = $product;

    // Get related products
    $related_limit               = wc_get_loop_prop( 'columns' );
    $related_ids                 = wc_get_related_products( $context['post']->id, $related_limit );
    $context['related_products'] =  Timber::get_posts( $related_ids );

    // Restore the context and loop back to the main query loop.
    wp_reset_postdata();

    Timber::render( 'views/woocommerce/single-product.twig', $context );

} else {

    /* SHOP ARCHIVE VIEW */
    $posts               = Timber::get_posts();
    $context['products'] = $posts;

    if ( is_product_category() ) {
        $queried_object      = get_queried_object();
        $term_id             = $queried_object->term_id;
        $context['category'] = get_term( $term_id, 'product_cat' );
        $context['title']    = single_term_title( '', false );
    } else {
        $post                 = Timber::get_post(get_option('woocommerce_shop_page_id'));
        $context['title']     = $post->title;
        $context['content']   = $post->content;

        // ACF(s) for store archive page
        $context['main_headline']          = get_field('main_headline');
        $context['include_call_to_action'] = get_field('include_call_to_action');
        $context['call_to_action']         = get_field('call_to_action');
    }

    Timber::render( 'views/woocommerce/store-archive.twig', $context );
}