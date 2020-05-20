<?php
/**
 * Author: Reena Hensley
 * Template Name: Landing
 */

use Conifer\Post\Page;

// Get common/site-wide data
$data = $site->context(['post' => new Page()]);

// Render the default view
Timber::render( 'template-landing.twig', $data );
