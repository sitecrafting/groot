<?php
/**
 * Author: Coby Tamayo
 */

use Timber\Timber;

$data = Timber::context();

Timber::render( 'single.twig', $data );
