<?php
/**
 * Custom search form markup
 */

use Timber\Timber;

$data = Timber::get_context();
Timber::render( 'partials/blocks/searchform.twig', $data );

?>
