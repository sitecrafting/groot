<?php
use Timber\Timber;

$data = Timber::context();

Timber::render( 'single.twig', $data );
