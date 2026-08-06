<?php

/**
 * Unit tests for the Page post type. 
 * 
 * Because this post type is a thin wrapper around Conifer's Page, and
 * that page is already extensively tested we only need minimal testing.
 */

namespace Conifer\Unit;

use Conifer\Post\Page as ConiferPage;
use PHPUnit\Framework\MockObject\MockObject;
use Project\Post\Page;

class PageTest extends Base
{
    protected null|MockObject|Page $page = null;

    public function setUp(): void
    {
        parent::setUp();

        $this->page = $this->getMockBuilder(Page::class)
            ->disableOriginalConstructor()
            ->getMock();
    }

    public function test_page_is_instance_of_conifer_page()
    {
        $this->assertInstanceOf(ConiferPage::class, $this->page);
    }
}
