<?php

namespace Project;

/**
 * Wrapper for any and all theme-specific behavior.
 *
 * @copyright 2015 SiteCrafting, Inc.
 * @author Coby Tamayo
 */
class Site extends \TimberSite {
	protected $assets_version;

	/**
	 * @var array An associative array of Twig functions.
	 * Keys are function names and values are closures.
	 */
	protected $twig_functions = [];

	/**
	 * @var array An associative array of Twig filters.
	 * Keys are function names and values are closures.
	 */
	protected $twig_filters = [];

	/**
	 * Constructor
	 */
	public function __construct() {
		parent::__construct();
	}

	/**
	 * Configure any WordPress hooks and register site-wide components, such as nav menus
	 * @return Project\Site the Site object it was called on
	 */
	public function configure() {
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'menus' );

		// configure Twig/Timber
		add_filter( 'timber_context', [$this, 'add_to_context'] );
		add_filter( 'get_twig', [$this, 'add_to_twig'] );

		add_action( 'wp_enqueue_scripts', [$this, 'enqueue_scripts_and_styles'] );

		add_action( 'admin_init', ['\Project\Admin', 'init'] );
		add_action( 'init', ['\Project\Admin', 'add_theme_settings_page'] );

		// Add default Twig filters/functions
		\TwigWrapper\Filters\Number::add_twig_filters( $this );
		\TwigWrapper\Filters\TextHelper::add_twig_filters( $this );
		\TwigWrapper\Filters\TermHelper::add_twig_filters( $this );
		\TwigWrapper\Functions\WordPress::add_twig_functions( $this );

		// Override how native WP galleries work
		add_image_size( 'gallery', 900, 600, true );
		remove_shortcode( 'gallery' );
		\Shortcode\Gallery::register( 'gallery' );

		// register common nav menus
		register_nav_menus([
			'primary' => 'Main Navigation', // main page/nav structure
			'global' => 'Global Navigation', // for stuff like social icons
			'footer' => 'Footer Navigation', // footer links
		]);

		// widget area
		register_sidebar([
			'name' => 'Main Sidebar',
			'id' => 'main-sidebar'
		]);

		// Banish the Yoast SEO meta box to the bottom of the post edit screen, where it belongs
		add_filter( 'wpseo_metabox_prio', function() { return 'low';});



		return $this;
	}

	/**
	 * Enqueue custom JS/CSS
	 */
	public function enqueue_scripts_and_styles() {
		/*
		 * Enqueue our own project-specific JavaScript, including dependencies.
		 * If you need to add a script to be enqueued and it's ok to do so site-wide, please consider doing so via Grunt
		 * instead of here to reduce page load times.
		 */
		wp_enqueue_script(
			'project-common',
			$this->get_script_uri('project-common.min.js'),
			$dependencies = ['jquery'],
			$version = $this->get_assets_version(),
			$inFooter = true
		);

		// NOTE: If you do need to enqueue additional scripts here, please enqueue them in the footer
		// unless there's a very good reason not to.

		wp_enqueue_style(
			'project-css',
			$this->get_stylesheet_uri('style.css'),
			$dependencies = [],
			$version = $this->get_assets_version()
		);
		wp_enqueue_style(
			'project-print-css',
			$this->get_stylesheet_uri('print.css'),
			$dependencies = [],
			$version = $this->get_assets_version(),
			'print'
		);
	}

	/**
	 * Get the current Timber context, with the "post" index set to $post
	 * @param Project\Post $post the current Post object
	 * @return array the Timber context
	 */
	public function get_context_with_post( Post $post ) {
		$context = \Timber::get_context();
		$context['post'] = $post;
		return $context;
	}

	/**
	 * Get the current Timber context, with the "posts" index set to $posts
	 * @param array $posts an array of Project\Post objects
	 * @return array the Timber context
	 */
	public function get_context_with_posts( array $posts ) {
		$context = \Timber::get_context();
		$context['posts'] = $posts;
		return $context;
	}

	/**
	 * Add arbitrary data to the site-wide context array
	 * @param array $context the default context
	 * @return array the updated context
	 */
	public function add_to_context( $context ) {
		$context['site'] = $this;
		$context['primary_menu'] = new Menu( 'primary' );
		$context['main_sidebar'] = \Timber::get_widgets( 'main-sidebar' );
		$context['body_classes'] = get_body_class();
		$context['search_query'] = get_search_query();
		return $context;
	}

	/**
	 * Register a custom Twig filter to be added at render time via the
	 * "get_twig" WordPress filter
	 * @param string $name the name of the filter
	 * @param callable $filter a callable that implements the custom filter
	 * @return Project\Site the Site object it was called on
	 */
	public function add_twig_filter( $name, callable $filter ) {
		$this->twig_filters[$name] = $filter;
		return $this;
	}

	/**
	 * Register a custom Twig function to be added at render time via
	 * the "get_twig" WordPress filter
	 * @param string $name the name of the function
	 * @param callable $function a callable that implements the custom function
	 * @return Project\Site the Site object it was called on
	 */
	public function add_twig_function( $name, callable $function ) {
		$this->twig_functions[$name] = $function;
		return $this;
	}

	/**
	 * Add your own extenstions/filters/functions to the internal Twig environment.
	 * @param Twig_Environment $twig Timber's internal Twig_Environment instance
	 * @return Twig_Environment the extended Twig instance
	 */
	public function add_to_twig( $twig ) {
		$twig->addExtension( new \Twig_Extension_StringLoader() );

		// Make debugging available through Twig
		// Note: in order for Twig's dump() function to work,
		// the WP_DEBUG constant must be set to true in wp-config.php
		$twig->addExtension( new \Twig_Extension_Debug() );

		foreach( $this->twig_functions as $name => $callable ) {
			$function = new \Twig_SimpleFunction( $name, $callable );
			$twig->addFunction( $function );
		}

		foreach( $this->twig_filters as $name => $callable ) {
			$filter = new \Twig_SimpleFilter( $name, $callable );
			$twig->addFilter( $filter );
		}

		return $twig;
	}

	/**
	 * Get the full URI for a script file
	 * @param string $file the base file name (relative to js/)
	 * @return the script's full URI
	 */
	protected function get_script_uri( $file ) {
		return get_stylesheet_directory_uri() . '/js/' . $file;
	}

	/**
	 * Get the full URI for a stylesheet
	 * @param string $file the base file name (relative to the theme dir URI)
	 * @return the stylesheet's full URI
	 */
	protected function get_stylesheet_uri( $file ) {
		return get_stylesheet_directory_uri() . '/' . $file;
	}

	/**
	 * Get the Grunt-generated hash for global assets
	 * @return the hash for
	 */
	protected function get_assets_version() {
		if( ! $this->assets_version && is_readable(get_stylesheet_directory().'/assets.version') ) {
			$this->assets_version = trim( file_get_contents(get_stylesheet_directory().'/assets.version') );
		}

		// Cache the version in this object
		return $this->assets_version;
	}

}