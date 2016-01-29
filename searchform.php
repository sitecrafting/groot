<?php
/**
 * Custom search form markup
 */

$data = Timber::get_context();
Timber::render( 'searchform.twig', $data );

?>