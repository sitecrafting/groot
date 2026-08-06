<?php

/**
 * Unit tests for the FrontPage post type. 
 * 
 * Because this post type is a thin wrapper around Conifer's FrontPage, and
 * that page is already extensively tested we only need minimal testing.
 */

namespace Conifer\Unit;

use Conifer\Post\BlogPost as ConiferBlogPost;
use PHPUnit\Framework\MockObject\MockObject;
use Project\Post\BlogPost;

class BlogPostTest extends Base
{
    protected null|MockObject|BlogPost $page = null;

    public function setUp(): void
    {
        parent::setUp();

        $this->page = $this->getMockBuilder(BlogPost::class)
            ->disableOriginalConstructor()
            ->getMock();
    }

    public function test_page_is_instance_of_conifer_blog_post()
    {
        $this->assertInstanceOf(ConiferBlogPost::class, $this->page);
    }
}
