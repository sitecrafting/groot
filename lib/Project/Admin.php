<?php

namespace Project;

class Admin {
	const PLUGIN_ACF_PRO = 'advanced-custom-fields-pro/acf.php';

	public static function add_theme_settings_page() {
		if( function_exists('acf_add_options_page') ) {
			acf_add_options_page([
				'page_title' => 'Theme Settings',
				'menu_slug' => 'theme-settings',
			]);
		}
	}

	/**
	 * To be called during the admin_init hook
	 */
	public static function init() {
		if( ! is_plugin_active( static::PLUGIN_ACF_PRO ) ) {
			static::notify(
				'Advanced Custom Fields Pro is not activated!
				Your site may not function properly without it.'
			);
		}

		static::check_for_notices();
	}

	public static function check_for_notices() {
		if( isset($_SESSION['admin_notices']) ) {
			$notices = $_SESSION['admin_notices'];
		} else {
			return;
		}

		foreach( $notices as $notice ) {
			static::notify( $notice['message'], $notice['class'] );
		}

		$_SESSION['admin_notices'] = null;
	}

	public static function notify_after_redirect( $message, $class = 'error' ) {
		$_SESSION['admin_notices'] = $_SESSION['admin_notices'] ?: [];
		$_SESSION['admin_notices'][] = [
			'message' => $message,
			'class' => $class,
		];
	}

	public static function notify( $message, $class = 'error' ) {
		add_action( 'admin_notices', function() use ($message, $class) {
			echo "<div class=\"{$class}\"><p>{$message}</p></div>";
		});
	}
}

