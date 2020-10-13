<?php
/**
 * Custom search form markup
 */

use Timber\Timber;

$data = Timber::context();
Timber::render( 'partials/searchform.twig', $data );

?>
