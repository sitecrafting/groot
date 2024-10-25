<?php
/**
 * Custom search form markup
 */

use Timber\Timber;

$data = Timber::context();
Timber::render( 'partials/blocks/searchform.twig', $data );

?>
