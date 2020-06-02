## WooCommerce/Groot Integration 

### Plugin set up

Procurring the WooCommerce plugin files

- Download the free WooCommerce plugin found here: https://docs.woocommerce.com/documentation/plugins/woocommerce/
- You will need to create an account

Adding WooCommerce plugin to the project

- Start the project if you have not already done so ( `lando start` and `lando pull` )
- Navigate to the `wp-content/plugins` folder
- Add the (unzipped) `woocommerce` plugin folder here

Activating WooCommerce plugin

- Activate the plugin in the Admin Center > Plugins > WooCommerce > Click "Activate"

  - **Note**: If you click "Not right now"  you will be redirected admin center dashboard.
  - To get back to the setup wizard navigate to  WooCommerce > Settings > Click "Run the Setup Wizzard"

- Click "Yes Please" to Start the WooCommerce setup wizard

  - Steps 1-4 : Add the stores address, type of industry, product types, and business details

  - Step 5: Choose Theme "Continue with my active theme"

  - Enhance your store with Jetpack? Choose "No Thanks"

  - After setup is complete there will be 4 new pages added to the "Pages" section

    - Cart - Cart Page
    - Checkout - Checkout Page
    - My account - My Account Page
    - Shop - Shop page

    There is also an **Optional** "Terms and conditions" page that you may set up manually by navigating to WooCommerce > Settings > Advanced

### Add Theme Support

The first step we need to declare WooCommerce support in your theme’s **functions.php** file like so:

```php
/**
 * Add Woocommerce support to the theme
 * Source: https://timber.github.io/docs/guides/woocommerce/
 * 
 * Additionally, declaring what sizes (widths) should be used.
 * Note: admin users will not be able to change these sizes.
 * Source: https://docs.woocommerce.com/document/image-sizes-theme-developers/
 * 
 * Add theme support for single product gallery slideshow on product detail page
 */
function theme_add_woocommerce_support() {
  add_theme_support( 'woocommerce', array(
    'thumbnail_image_width' => 400,
    'gallery_thumbnail_image_width' => 100,
    'single_image_width' => 500,
  ) );
  add_theme_support( 'wc-product-gallery-zoom' );
  add_theme_support( 'wc-product-gallery-lightbox' );
  add_theme_support( 'wc-product-gallery-slider' );
}
add_action( 'after_setup_theme', 'theme_add_woocommerce_support' );
```

We are enabling a few extra features for image sizes and gallery view. For more information about enabling/disabling features or for changing settings through theme support, please refer to the [WooCommerce Theme Developer Handbook](https://docs.woocommerce.com/document/woocommerce-theme-developer-handbook).

### Point of entry - passing data to the twig files

To integrate WooCommerce into our theme, create a file named **woocommerce.php** in the root of our **theme** folder. All WooCommerce pages will go through a file named `woocommerce.php`

```php
<?php
/**
 * Custom wooCommerce.php file
 */

if ( ! class_exists( 'Timber' ) ) {
    echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';
    return;
}

$context            = Timber::context();
$context['sidebar'] = Timber::get_widgets( 'shop-sidebar' );

if ( is_singular( 'product' ) ) {
    $context['post']    = Timber::get_post();
    $product            = wc_get_product( $context['post']->ID );
    $context['product'] = $product;

    // Get related products
    $related_limit               = wc_get_loop_prop( 'columns' );
    $related_ids                 = wc_get_related_products( $context['post']->id, $related_limit );
    $context['related_products'] =  Timber::get_posts( $related_ids );

    // Restore the context and loop back to the main query loop.
    wp_reset_postdata();

    Timber::render( 'views/woo/single-product.twig', $context );
} else {
    $posts               = Timber::get_posts();
    $context['products'] = $posts;

    if ( is_product_category() ) {
        $queried_object = get_queried_object();
        $term_id = $queried_object->term_id;
        $context['category'] = get_term( $term_id, 'product_cat' );
        $context['title'] = single_term_title( '', false );
    }

    Timber::render( 'views/woo/archive.twig', $context );
}
```

We will now need the two Twig files loaded from `woocommerce.php`:  `views/woo/archive.twig` and `views/woo/single-product.twig`.

### Creating template views

**Archive** file displays the product grid on the "Shop" page. 

`views/woo/archive.twig`

```twig
{% extends 'layouts/main.twig' %}

{% block woocommerce_block %}

<div class="pattern">
    {#
     # woocommerce_before_main_content hook.
     #
     # @hooked woocommerce_output_content_wrapper - 10 (outputs opening divs for the content)
     # @hooked woocommerce_breadcrumb - 20
     # @hooked WC_Structured_Data::generate_website_data() - 30
     #}
    {% do action('woocommerce_before_main_content') %}

    <h1 class="woocommerce-products-header__title page-title">{{ post.meta('main_headline')|default('Shop') }}</h1>

    {#
     # woocommerce_archive_description hook.
     #
     # @hooked woocommerce_taxonomy_archive_description - 10
     # @hooked woocommerce_product_archive_description - 10
     #}
    {% do action('woocommerce_archive_description') %}

    {#
     # woocommerce_before_shop_loop hook.
     #
     # @hooked wc_print_notices - 10
     # @hooked woocommerce_result_count - 20
     # @hooked woocommerce_catalog_ordering - 30
     #}
    <div class="before-shop-loop">
        {% do action('woocommerce_before_shop_loop') %}
    </div>

     <div class="loop">
        <ul class="products">
            {% for post in products %}
                <li class="product">
                    {% include 'woo/tease-product.twig' %}
                </li>
            {% endfor %}
        <ul>
    </div>

    {#
     # woocommerce_after_shop_loop hook.
     #
     # @hooked woocommerce_pagination - 10
     #}
    {% do action('woocommerce_after_shop_loop') %}

    {#
     # woocommerce_after_main_content hook.
     #
     # @hooked woocommerce_output_content_wrapper_end - 10 (outputs closing divs for the content)
     #}
    {% do action('woocommerce_after_main_content') %}
</div>

{% endblock %}
```



**Single Product** file displays the product details on the single product detail page. 

`views/woo/single-product.twig`

```twig
{% extends 'layouts/main.twig' %}

{% block woocommerce_block %}

<div class="pattern">

    {#
     # woocommerce_before_main_content hook.
     #
     # @hooked woocommerce_output_content_wrapper - 10 (outputs opening divs for the content)
     # @hooked woocommerce_breadcrumb - 20
     # @hooked WC_Structured_Data::generate_website_data() - 30
     #}
	{% do action( 'woocommerce_before_main_content' ) %}

	<article itemscope itemtype="http://schema.org/Product"  class="woocommmerce-wrapper single-product-details {{post.class}}">
		<div class="container">

			<div class="woocommerce-content">
				{##
				# woocommerce_before_single_product hook.
				#
				# @hooked wc_print_notices - 10
				#}
				{% do action('woocommerce_before_single_product') %}

				<div itemscope itemtype="http://schema.org/Product" class="single-product-details {{post.class}}">
					
					<div class="single-product-details-top">
						<div class="single-product-details-top__image">
							{##
							# woocommerce_before_single_product_summary hook.
							#
							# @hooked woocommerce_show_product_sale_flash - 10
							# @hooked woocommerce_show_product_images - 20
							#}
							{% do action('woocommerce_before_single_product_summary') %}
						</div>

						<div class="single-product-details-top__summary">
							{##
							# woocommerce_single_product_summary hook.
							#
							# @hooked woocommerce_template_single_title - 5
							# @hooked woocommerce_template_single_rating - 10
							# @hooked woocommerce_template_single_price - 10
							# @hooked woocommerce_template_single_excerpt - 20
							# @hooked woocommerce_template_single_add_to_cart - 30
							# @hooked woocommerce_template_single_meta - 40
							# @hooked woocommerce_template_single_sharing - 50
							# @hooked WC_Structured_Data::generate_product_data() - 60
							#}
							{% do action('woocommerce_single_product_summary') %}
						</div>
					</div>

					{##
					# woocommerce_after_single_product_summary hook.
					#
					# @hooked woocommerce_output_product_data_tabs - 10
					# @hooked woocommerce_upsell_display - 15
					# @hooked woocommerce_output_related_products - 20
					#}
					{% do action('woocommerce_after_single_product_summary') %}

					<meta itemprop="url" content="{{ post.link }}" />

				</div><!-- //.single-product-details -->

				{% do action('woocommerce_after_single_product') %}
			</div><!-- //.woocommerce-content -->

		</div>
	</article>

	{#
     # woocommerce_after_main_content hook.
     #
     # @hooked woocommerce_output_content_wrapper_end - 10 (outputs closing divs for the content)
     #}
	{% do action( 'woocommerce_after_main_content' ) %}

</div>

{% endblock  %}
```



**Tease Product** file displays the products in loops. 

`views/partials/tease-product.twig`

```twig
<article {{ fn('post_class', ['$classes', 'entry'] ) }}>

    {{ fn('timber_set_product', post) }}

    <div class="media">

        {% if showthumb %}
            <div class="media-figure {% if not post.thumbnail %}placeholder{% endif %}">
                <a href="{{ post.link }}">
                    {% if post.thumbnail %}
                        <img src="{{ post.thumbnail.src|resize(post_thumb_size[0], post_thumb_size[1]) }}" />
                    {% else %}
                        <span class="thumb-placeholder"><i class="icon-camera"></i></span>
                    {% endif %}
                </a>
            </div>
        {% endif %}

        <div class="media-content">
            {##
            # woocommerce_before_shop_loop_item_title hook.
            #
            # @hooked woocommerce_show_product_loop_sale_flash - 10
            # @hooked woocommerce_template_loop_product_thumbnail - 10
            #}
            {% do action('woocommerce_before_shop_loop_item_title') %}

            {% if post.title %}
                <h3 class="entry-title"><a href="{{ post.link }}">{{ post.title }}</a></h3>
            {% else %}
                <h3 class="entry-title"><a href="{{ post.link }}">{{ fn('the_title') }}</a></h3>
            {% endif %}

            {##
            # woocommerce_after_shop_loop_item_title hook.
            #
            # @hooked woocommerce_template_loop_rating - 5
            # @hooked woocommerce_template_loop_price - 10
            #}
            {% do action( 'woocommerce_after_shop_loop_item_title' ) %}
            {##
            # woocommerce_after_shop_loop_item hook.
            #
            # The second parameter is currently needed to prevent an issue with Timber action calls.
            #
            # @hooked woocommerce_template_loop_product_link_close - 5
            # @hooked woocommerce_template_loop_add_to_cart - 10
            #}
            {% do action( 'woocommerce_after_shop_loop_item' ) %}

        </div>

    </div>

</article>
```

*Note: There are several of WooCommerce’s default hooks and comments included explaing their use, this is to keep the integration seamless and allow any of the WooCommerce extension plugin to still work.*

**Back to the Functions file**

Products in the loop don’t get the right context by default. The line `{{ fn('timber_set_product', post) }}` above will call the following function that we need to add in our`functions.php` file (probably after we declade theme support).

```php
/** Fix for products in the loop that do not get the right context by default. */
function timber_set_product( $currPost ) {
  global $post, $product;
  if ( is_woocommerce() ) {
    $product = wc_get_product($currPost->ID);
    $post = get_post($currPost->ID);
  }
}
```

**Navigate to the main.twig file**

In order for the shop page to render correctly, we will need to add a block around the main content.

`views/layouts/main.twig` 

```php
{# added this block around the main tag because woocomerce injects its own main tag #}
{% block woocommerce_block %}
		<main class="site-main">
			{% block main_content %}
				Default main content
			{% endblock %}
		</main>
{% endblock %}
```



### Cart & Checkout page templates and views

Woocommerce cart and checkout are basically just shortcodes and will be what we will use. The shortcodes then looks for the default cart.php or checkout.php, but in our case, we will be overriding the default cart.php and checkout.php by creating these new pages in WordPress.



#### Page Templates

For this step we will create the new page which will act as the cart. Create a file named **template-cart.php** in the root of our **theme** folder.

`template-cart.php`

```php
<?php
/**
 * Author: [Name]
 * Template Name: Woocommerce Cart
 */

use Conifer\Post\Page;

// Get common/site-wide data
$data = $site->context(['post' => new Page()]);

Timber::render( 'cart.twig', $data );
```

And now we will create a new page that will act as checkout. Create a file named **template-checkout.php** in the root of our **theme** folder.

`template-checkout.php`

```php
<?php
/**
 * Author: [Name]
 * Template Name: Woocommerce Checkout
 */

use Conifer\Post\Page;

// Get common/site-wide data
$data = $site->context(['post' => new Page()]);

Timber::render( 'checkout.twig', $data );
```



#### **Page Views**

Those pages will now point to the twig files we will need to create.

Create a file named **cart.twig** in our views folder.

`views/cart.twig` 

```php
{% extends 'layouts/main.twig' %}

{% block main_content %}


<section class="woocommmerce-wrapper">
	<div class="container">

	<div class="pattern">
		<h1>{{ post.title }}</h1>
		
		{% filter shortcodes %}
			[woocommerce_cart]
		{% endfilter %}
	</div>

	</div><!-- END .container -->
</section>

{% endblock %}
```

Then create a file named **checkout.twig** in our views folder.

`views/checkout.twig` 

```php
{% extends 'layouts/main.twig' %}

{% block main_content %}


<section class="woocommmerce-wrapper">
	<div class="container">

	<div class="pattern">
		<h1>{{ post.title }}</h1>
		
		{% filter shortcodes %}
			[woocommerce_checkout]
		{% endfilter %}
	</div>

	</div><!-- END .container -->
</section>

{% endblock %}
```

Now that we have our page templates and page views created, we can set up the pages in the admin center.

**Navigate to the Admin Center**

- Pages > Hover over **Cart** > Click "Quick Edit" > Select "Woocommerce Cart" from the *Template* dropdown > Click "Update"

Do the same for the checkout page but select the "Woocommerce Checkout" template instead.

*Note: For any other pages that may need custom page templates (thank-you, my-account, etc ) just follow the same instructions for setting up page templates.*



### Wrapping up the loose ends

Below are a few more steps needed for the woocommerce integration.



#### Category Navigation (optional)

Back to the theme’s **functions.php** file and registrer a sidebar for the category nav.

```php
/** Woo Product Categories */
register_sidebar([
  'name' => 'Woo Product Categories',
  'id' => 'woo-product-categories'
]);
```

Create a **woo-product-categories.twig** file and place it in the woo views folder.

`views/woo/woo-product-categories.twig`

```php
<ul class="woocommerce-product-categories">
	{{ get_sidebar_widgets('woo-product-categories') }}
</ul>
```

Then add tthe following to the **archive.twig** file after the `h1` title

`views/woo/archive.twig`

```php
{# Product categories #}
<nav>{% include 'woo/woo-product-categories.twig' %}</nav>
```

**Navigate to the Admin center to set up the category widget**. 

- Admin center > Appearance > Widget > Find "Product Categories" > Drag over to "Woo Product Categories" > Select options and configurations > Click "Save"



#### Creating a functions folder

If we plan on adding functions and making use of hooks/filters to the WooCommerce plugin, which we do, we should create a place for all this functionality to live. This is so we can keep our functions.php file less cluttered with all of the WooCommerce customizations. Start by adding the following require function to our functions.php file.

```php
 /** Woocommerce customized filters and hooks */
 require_once(get_template_directory().'/functions/woocommerce-shop.php');
```

Then we will want to add a **function** folder in the root of our **theme** folder and add a file called `woocommerce-shop.php`

For more information on how to use filters: https://docs.woocommerce.com/document/introduction-to-hooks-actions-and-filters/ 

To see list of avalible WooCommerce filters: https://docs.woocommerce.com/wc-apidocs/hook-docs.html

This file is where we can add all of our filters. For starters, below are two filters that can be added.

`/functions/woocommerce-shop.php`

```php
<?php
/**
 * File for Woocommerce filters and hooks
 */

/**
 * Change number of products that are displayed per page (shop page)
 * Source: https://docs.woocommerce.com/document/change-number-of-products-displayed-per-page/
 * 
 * Return the number of products you want to show per page.
 */
add_filter( 'loop_shop_per_page', 'new_loop_shop_per_page', 20 );
function new_loop_shop_per_page( $cols ) {
  // $cols contains the current number of products per page based on the value stored on Options -> Reading
  $cols = 12;
  return $cols;
}

/**
 * Woocommerce has a default message that it shows if you tick the box but don’t type any message. 
 * This filter changes that default message
 * 
 * Display a Store Notice (Optional)
 * To show customers a site-wide Store Notice:
 * Go to: Appearance > Customize > WooCommerce > Store Notice:
 */
add_filter( 'woocommerce_demo_store', 'wc_custom_store_notice_updated' );
function wc_custom_store_notice_updated( $text ) {
	return str_replace( 'This is a demo store for testing purposes &mdash; no orders shall be fulfilled.', '<a href="/shop/">Check out our items.</a>', $text );
}
```



#### ACF Integration

In order to get advanced custom fields on the woocommerce shop page, we will need to add these filters to our **woocommerce-shop.php** file.

`/functions/woocommerce-shop.php`

```php
/**
 * Adding a custom location rule for ACF Woocommerce Shop page 
 * This filter adds a location to ACF location rule section.
 * 
 * Page Type -> WooCommerce Shop Page
 * 
 * Source: https://www.advancedcustomfields.com/resources/custom-location-rules/
 */
add_filter( 'acf/location/rule_values/page_type', function ( $choices ) {
  $choices['woo_shop_page'] = 'WooCommerce Shop Page';
  return $choices;
});

add_filter( 'acf/location/rule_match/page_type', function ( $match, $rule, $options ) {
  if ( $rule['value'] == 'woo_shop_page' && isset( $options['post_id']) ) {
      if ( $rule['operator'] == '==' )
          $match = ( $options['post_id'] == wc_get_page_id( 'shop' ) );
      if ( $rule['operator'] == '!=' )
          $match = ( $options['post_id'] != wc_get_page_id( 'shop' ) );
  }
  return $match;
}, 10, 3 );
```

The page type "WooCommerce Shop Page" will now show when selecting a location when creation an ACF.



#### CSS/Less

We will want to overwrite some of the default woocommerce styles and add our own custom styles.

In the **style.less** file add the following import to the elements and pieces section.

```php
/* ====================
    ELEMENT/PIECES
=======================*/
@import "elements/pieces/woocommerce.less"; //ONLY USE THIS IF WOOCOMMERCE IS IN USE

```

Create a file **woocommerce.less** to the pieces less folder and add the following.

`/less/elements/pieces/woocommerce.less`

```php
/* ==========================
    CUSTOM BASE FOR WOOCOMMERCE
=============================*/

.woocommerce{

    // buttons
    button.button, a.button, a.button.alt, button.button.alt{
        display: inline-block;
        padding: 19px 40px;
        cursor: pointer;
        border-radius: 0;
        border: 0;
    
        color: @white;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: .5px;
        font: 700 16px/1.1 @font-family-headings;
    
        background: @blue;
        -webkit-appearance: none;
    
        transition: all @trans-speed ease;
    
        &:hover {
            text-decoration: none;
            color: @white;
            background: darken(@blue,5%);
        }
        &:disabled{
            padding: 19px 40px !important;
            background: @gray-f3 !important;
            color: @black;
            cursor: not-allowed;
            &:hover{ background: @gray-f3; }
        }
    }

    // woo form
    form{
        .form-row.required {
            color: @error;
        }
    }

    // archive product grid
    ul.products, .woocommerce-page ul.products{
        li{
            margin-right: 3.9% !important;
            &:nth-child(4n){ margin-right: 0 !important; }
        }
    }

    // single product details product content
    .single-product-details-top__summary{
        float: right;
        width: 50%;
        @media @mobile-all {
            float: none;
            width: 100%;
        }
    }

    // single product details product gallery
    .woocommerce-product-gallery{
        ol.flex-control-nav{
            padding-top: 10px !important;
            li:first-child{ padding-left: 0; }
        }
    }

}//end .woocommerce

// Optional store notice banner
// .woocommerce-store-notice, p.demo_store {
//     background-color: @blue;
// }
```

*Note: to compile run `lando webpack` in your terminal*



#### Setting up test products

Navigate to the admin center

- Products > Click "Create Product"

- Folow the prompts

- Publish

  

#### Other Woocommerce Settings need to be set up

- Payment Processing
- Terms and conditions (optional)
- Privacy Policy (optional)
- Taxes (optional)
- Need to add svg arrow down for shop page: /wp-content/themes/groot/img/arrows/chevron-down.svg


#### Updating WooCommerce

**Note:** Need to take care when updating woocommerce as sometime woocommerce needs to update the templates we have overwritten.

https://docs.woocommerce.com/document/template-structure/

https://docs.woocommerce.com/document/fix-outdated-templates-woocommerce/