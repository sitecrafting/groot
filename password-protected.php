<?php
use Timber\Timber;

$data = Timber::context([
    'password_form' => get_the_password_form(),
]);

Timber::render('password-protected.twig', $data);
