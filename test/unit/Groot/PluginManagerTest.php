<?php

/**
 * Unit tests for the PluginManager class.
 */

namespace Groot {
    class TestHookCapture
    {
        public static array $callbacks = [];
    }

    function add_action($tag, $function_to_add, $priority = 10, $accepted_args = 1)
    {
        TestHookCapture::$callbacks[$tag] = $function_to_add;

        return \WP_Mock::onActionAdded($tag)->react(
            $function_to_add,
            (int) $priority,
            (int) $accepted_args
        );
    }

    function admin_url()
    {
        return \WP_Mock\Handler::predefined_return_function_helper('admin_url', func_get_args());
    }

    function esc_url()
    {
        return \WP_Mock\Handler::predefined_return_function_helper('esc_url', func_get_args());
    }

    function __()
    {
        return \WP_Mock\Handler::predefined_return_function_helper('__', func_get_args());
    }
}

namespace Conifer\Unit {

    require_once __DIR__ . '/../../../lib/Groot/PluginManager.php';

    class PluginManagerTest extends \Conifer\Unit\Base
    {
        private PluginManagerTestSpy $pluginManager;

        public function setUp(): void
        {
            parent::setUp();
            \Groot\TestHookCapture::$callbacks = [];

            $this->pluginManager = new PluginManagerTestSpy();
        }

        public function test_constructor_should_construct_a_plugin_manager_object()
        {
            $pluginManager = new \Groot\PluginManager();

            $this->assertInstanceOf(\Groot\PluginManager::class, $pluginManager);
        }

        public function test_constructor_should_initialize_an_empty_required_classes_array()
        {
            $this->assertSame([], $this->pluginManager->getRequiredClasses());
        }

        public function test_require_classes_should_add_classes_to_the_required_classes_array()
        {
            $this->pluginManager->require_classes([
                'Timber\\Timber',
                'Conifer\\Site',
            ]);

            $this->assertSame([
                'Timber\\Timber',
                'Conifer\\Site',
            ], $this->pluginManager->getRequiredClasses());
        }

        public function test_requirements_met_should_return_true_if_all_required_classes_exist()
        {
            $this->pluginManager->require_classes([\Timber\Timber::class]);

            $this->assertTrue($this->pluginManager->requirements_met());
            $this->assertSame(0, $this->pluginManager->adminWarningCalls);
        }

        public function test_requirements_met_should_return_false_if_any_required_classes_do_not_exist()
        {
            $this->pluginManager->require_classes(['Definitely\\Missing\\PluginClass']);

            $this->assertFalse($this->pluginManager->requirements_met(false));
            $this->assertSame(0, $this->pluginManager->adminWarningCalls);
        }

        public function test_requirements_met_should_call_generate_admin_warning_when_missing_classes_exist_and_admin_warnings_are_enabled()
        {
            \WP_Mock::expectActionAdded('admin_notices', '__CLOSURE__');
            $this->pluginManager->require_classes(['Definitely\\Missing\\PluginClass']);

            $this->assertFalse($this->pluginManager->requirements_met(true));
            $this->assertSame(1, $this->pluginManager->adminWarningCalls);
        }

        public function test_requirements_met_should_not_call_generate_admin_warning_when_missing_classes_exist_and_admin_warnings_are_disabled()
        {
            $this->pluginManager->require_classes(['Definitely\\Missing\\PluginClass']);

            $this->assertFalse($this->pluginManager->requirements_met(false));
            $this->assertSame(0, $this->pluginManager->adminWarningCalls);
        }

        public function test_get_implementing_plugin_should_return_the_correct_plugin_slug_and_name_for_timber()
        {
            $this->assertSame([
                'slug' => 'timber',
                'name' => 'Timber',
            ], $this->pluginManager->getImplementingPlugin('Timber\\Timber'));
        }

        public function test_get_implementing_plugin_should_return_the_correct_plugin_slug_and_name_for_conifer()
        {
            $this->assertSame([
                'slug' => 'conifer',
                'name' => 'Conifer',
            ], $this->pluginManager->getImplementingPlugin('Conifer\\Site'));
        }

        public function test_get_implementing_plugin_should_return_a_generic_plugin_name_for_any_other_class()
        {
            $this->assertSame([
                'name' => 'The plugin that implements the Foo\\Bar class',
            ], $this->pluginManager->getImplementingPlugin('Foo\\Bar'));
        }

        public function test_generate_admin_warning_should_add_an_admin_notice_action_with_the_correct_message()
        {
            \WP_Mock::expectActionAdded('admin_notices', '__CLOSURE__');
            \WP_Mock::userFunction('admin_url', [
                'times' => 1,
                'args' => ['plugins.php#timber'],
                'return' => 'https://example.test/wp-admin/plugins.php#timber',
            ]);
            \WP_Mock::userFunction('esc_url', [
                'times' => 1,
                'return_arg' => 0,
            ]);
            \WP_Mock::userFunction('__', [
                'times' => 1,
                'args' => ['here'],
                'return' => 'here',
            ]);

            $this->pluginManager->triggerGenerateAdminWarning([
                'slug' => 'timber',
                'name' => 'Timber',
            ]);

            $capturedCallback = \Groot\TestHookCapture::$callbacks['admin_notices'] ?? null;
            $this->assertIsCallable($capturedCallback);

            ob_start();
            $capturedCallback();
            $output = ob_get_clean();

            $this->assertSame(
                '<div class="error"><p>Timber is not activated. Make sure to activate it <a href="https://example.test/wp-admin/plugins.php#timber">here</a></p></div>',
                $output
            );
        }
    }

    class PluginManagerTestSpy extends \Groot\PluginManager
    {
        public int $adminWarningCalls = 0;

        public function getRequiredClasses(): array
        {
            return $this->required_classes;
        }

        public function getImplementingPlugin(string $class): array
        {
            return $this->get_implementing_plugin($class);
        }

        public function triggerGenerateAdminWarning(array $plugin): void
        {
            $this->generate_admin_warning($plugin);
        }

        protected function generate_admin_warning(array $plugin)
        {
            $this->adminWarningCalls++;

            return parent::generate_admin_warning($plugin);
        }
    }
}
