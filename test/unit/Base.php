<?php

/**
 * Base class for Conifer test cases
 *
 * @copyright 2018 SiteCrafting, Inc.
 * @author    Coby Tamayo <ctamayo@sitecrafting.com>
 */

namespace Conifer\Unit;

use PHPUnit\Framework\TestCase;

class Base extends TestCase
{
    public function test_multisite_mode()
    {
        $isMultisite = defined('MULTISITE') && MULTISITE;
        $this->assertEquals(getenv('WP_MULTISITE') ? true : false, $isMultisite);
    }
}
