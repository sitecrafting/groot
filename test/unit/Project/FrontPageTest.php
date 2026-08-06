<?php

/**
 * Unit tests for the FrontPage post type. 
 * 
 * Because this post type is a thin wrapper around Conifer's FrontPage, and
 * that page is already extensively tested we only need minimal testing.
 */

namespace Conifer\Unit;

use Conifer\Post\FrontPage as ConiferFrontPage;
use PHPUnit\Framework\MockObject\MockObject;
use Project\Post\FrontPage;

class FrontPageTest extends Base
{
    protected null|MockObject|FrontPage $page = null;

    public function setUp(): void
    {
        parent::setUp();

        $this->page = $this->getMockBuilder(FrontPage::class)
            ->disableOriginalConstructor()
            ->getMock();
    }

    public function test_page_is_instance_of_conifer_front_page()
    {
        $this->assertInstanceOf(ConiferFrontPage::class, $this->page);
    }
}
