<?php

/**
 * Unit tests for the ThemeTwigHelper class.
 */

// Namespace function overrides for the Project\Twig namespace.
// These intercept calls made inside ThemeTwigHelper without modifying the source file.
namespace Project\Twig {
    /**
     * Override function_exists() so tests can control whether gtm4wp_the_gtm_tag
     * appears to be defined, without actually defining a global function.
     */
    function function_exists(string $name): bool
    {
        if ($name === 'gtm4wp_the_gtm_tag') {
            return $GLOBALS['__test_gtm4wp_function_exists'] ?? false;
        }
        return \function_exists($name);
    }

    /**
     * Namespace-local stub for gtm4wp_the_gtm_tag(). PHP resolves unqualified
     * function calls to the current namespace first, so when
     * ThemeTwigHelper::gtm4wp_the_gtm_tag() calls gtm4wp_the_gtm_tag() this
     * stub is invoked instead of the real plugin function.
     */
    function gtm4wp_the_gtm_tag(): mixed
    {
        return $GLOBALS['__test_gtm4wp_return_value'] ?? null;
    }
}

namespace Conifer\Unit {

    use Project\Twig\ThemeTwigHelper;

    class ThemeTwigHelperTests extends \Conifer\Unit\Base
    {
        private ThemeTwigHelper $helper;

        public function setUp(): void
        {
            parent::setUp();
            // Reset globals controlling the namespace overrides before each test
            unset($GLOBALS['__test_gtm4wp_function_exists']);
            unset($GLOBALS['__test_gtm4wp_return_value']);

            $this->helper = new ThemeTwigHelper();
        }

        // case 1: get_functions returns an array containing all expected keys
        public function test_get_functions_returns_array_with_expected_keys(): void
        {
            $functions = $this->helper->get_functions();

            $this->assertIsArray($functions);
            $this->assertArrayHasKey('gtm4wp_the_gtm_tag', $functions);
            $this->assertArrayHasKey('get_posts_pattern', $functions);
            $this->assertArrayHasKey('get_related_posts', $functions);
        }

        // case 2: get_functions returns a callable for each registered key
        public function test_get_functions_returns_callable_values(): void
        {
            $functions = $this->helper->get_functions();

            $this->assertIsCallable($functions['gtm4wp_the_gtm_tag']);
            $this->assertIsCallable($functions['get_posts_pattern']);
            $this->assertIsCallable($functions['get_related_posts']);
        }

        // case 3: get_filters returns an empty array
        public function test_get_filters_returns_empty_array(): void
        {
            $this->assertSame([], $this->helper->get_filters());
        }

        // case 4: gtm4wp_the_gtm_tag returns false when the function does not exist
        public function test_gtm4wp_the_gtm_tag_returns_false_when_function_does_not_exist(): void
        {
            $GLOBALS['__test_gtm4wp_function_exists'] = false;

            $this->assertFalse($this->helper->gtm4wp_the_gtm_tag());
        }

        // case 5: gtm4wp_the_gtm_tag returns the expected value when the function exists
        public function test_gtm4wp_the_gtm_tag_returns_expected_value_when_function_exists(): void
        {
            $GLOBALS['__test_gtm4wp_function_exists'] = true;
            $GLOBALS['__test_gtm4wp_return_value']    = '<script>GTM_TAG</script>';

            $this->assertSame('<script>GTM_TAG</script>', $this->helper->gtm4wp_the_gtm_tag());
        }

        // case 6: get_related_posts calls get_related_by_category with the default count of 3
        public function test_get_related_posts_calls_get_related_by_category_with_default_count(): void
        {
            $mockPost = $this->createMock(\Project\Post\BlogPost::class);
            $mockPost->expects($this->once())
                ->method('get_related_by_category')
                ->with(3)
                ->willReturn([new \stdClass(), new \stdClass(), new \stdClass()]);

            $result = $this->helper->get_related_posts($mockPost);

            $this->assertCount(3, $result);
        }

        // case 7: get_related_posts passes the given postCount to get_related_by_category
        public function test_get_related_posts_passes_postCount_to_get_related_by_category(): void
        {
            $mockPost = $this->createMock(\Project\Post\BlogPost::class);
            $mockPost->expects($this->once())
                ->method('get_related_by_category')
                ->with(5)
                ->willReturn(array_fill(0, 5, new \stdClass()));

            $result = $this->helper->get_related_posts($mockPost, 5);

            $this->assertCount(5, $result);
        }

        // case 8: get_related_posts returns an empty array when the post has no related posts
        public function test_get_related_posts_returns_empty_array_when_no_related_posts(): void
        {
            $mockPost = $this->createMock(\Project\Post\BlogPost::class);
            $mockPost->expects($this->once())
                ->method('get_related_by_category')
                ->willReturn([]);

            $this->assertSame([], $this->helper->get_related_posts($mockPost));
        }

        // case 10: get_related_posts returns exactly the posts returned by get_related_by_category
        public function test_get_related_posts_returns_posts_from_get_related_by_category(): void
        {
            $mockPost   = $this->createMock(\Project\Post\BlogPost::class);
            $relatedOne = new \stdClass();
            $relatedTwo = new \stdClass();
            $expected   = [$relatedOne, $relatedTwo];

            $mockPost->expects($this->once())
                ->method('get_related_by_category')
                ->willReturn($expected);

            $this->assertSame($expected, $this->helper->get_related_posts($mockPost));
        }
    }
}
