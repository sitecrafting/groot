<?php
/**
 * Author: Coby Tamayo
 */

use Timber\Timber;

$data = $site->context();

Timber::render( 'single.twig', $data );
