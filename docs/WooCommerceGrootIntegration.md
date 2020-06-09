# WooCommerce/Groot Integration 

Below are steps for integrating the Woocommerce into the Groot Wordpress theme. [WooCommerce](https://woocommerce.com/) is a free, customizable, open-source eCommerce platform built on WordPress.

## Plugin set up

Current version at the time of writing: Woocommerce Version 4.2.0. 

### Procuring the WooCommerce plugin files

- Download the free WooCommerce plugin found here:
  -  https://docs.woocommerce.com/documentation/plugins/woocommerce/
- You will need to create an account

### Adding WooCommerce plugin to the project:

- Start the project if you have not already done so ( `lando start` and `lando pull` )
- Navigate to the **/wp-content/plugins** folder
- Add the (unzipped) `woocommerce` plugin folder here

### Activating WooCommerce plugin:

- Activate the plugin in the Admin Center > Plugins > WooCommerce > Click "Activate"

  - **Note**: If you click "Not right now"  you will be redirected admin center dashboard.
  - To get back to the setup wizard navigate to  WooCommerce > Settings > Click "Run the Setup Wizzard"

- Click "Yes Please" to Start the WooCommerce setup wizard

  - Steps 1-4 : Add the stores address, type of industry, product types, and business details
- Step 5: Choose Theme "Continue with my active theme"
  - Enhance your store with Jetpack? Choose "No Thanks"
  - Even though we do not wish to enhance our store, Jet pack may still be among the plugin list anyway, you can "Delete" this plugin

- After the setup is complete there will be 4 new pages added to the "Pages" section

  - Cart - Cart Page
  - Checkout - Checkout Page
  - My account - My Account Page
  - Shop - Shop page

  There is also an **Optional** "Terms and conditions" page that you may set up manually by navigating to WooCommerce > Settings > Advanced

## Custom Folders

### Twig Woocommerce Folder

We will need a **woocommerce** twig folder holds all of our custom views. This folder should be placed in our themes **/views** folder.

 `/views/woocommerce` - this folder should contain:

- partials (folder)
  - card-product.twig
  - widget-sidebar.twig
- single-product.twig
- store-archive.twig

### CSS/Less Woocommerce Folder

We will want to overwrite some of the default woocommerce styles and add our own custom styles. The **woocommerce** less folder should be placed in the **/less/elements** folder.

 `/less/elements/woocommerce` - this folder should contain:

- card-product.less
- sidebar-widget.less
- single-product-details.less
- woocommerce-breadcrumbs.less
- woocommerce.less

In the **style.less** file add the following:

```php
/* ===================
	WOOCOMMERCE
=====================*/
@import "elements/woocommerce/woocommerce.less"; //ONLY USE THIS IF WOOCOMMERCE IS IN USE
```

*Note: to compile run `lando webpack` in your terminal*

### Functions Folder

If we plan on adding functions and making use of the hooks/filters in the WooCommerce plugin, which we do, we should create a place for all of this functionality to live. This is so we can keep our functions.php file less cluttered with any of the WooCommerce customizations we do. Start by adding the following require function to our **functions.php** file.

```php
/** Woocommerce setup */
 require_once(get_template_directory().'/functions/woocommerce-shop.php');
```

Next, we will want to add the **function** folder in the root of our **theme** folder. In that folder there should be `woocommerce-shop.php`

- For more information on how to use filters: https://docs.woocommerce.com/document/introduction-to-hooks-actions-and-filters/ 

- To see list of available WooCommerce filters: https://docs.woocommerce.com/wc-apidocs/hook-docs.html

#### Add Theme Support

This file is where we can add all of our filters. For starters, we need to make sure our theme supports WooCommerce. The following bit of code will already be in your `woocommerce-shop.php` file. We are enabling a few extra features where we declare our image sizes and add gallery support for the single product page.

For more information about enabling/disabling features or for changing settings through theme support, please refer to the [WooCommerce Theme Developer Handbook](https://docs.woocommerce.com/document/woocommerce-theme-developer-handbook).

`/functions/woocommerce-shop.php`

```php
<?php
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

**Note:** There are a few additional default filters/action already set up in this file. See comments for details.

#### ACF Integration

In order to get advanced custom fields on the woocommerce shop page we have already added a filter to `woocommerce-shop.php` 

In the admin center the page type "WooCommerce Shop Page" will now show when selecting a location when creating an ACF.

#### Category Navigation

Another function we have already added to `woocommerce-shop.php`, is for registering a sidebar widget for the category navigation. It has already been set up in the code, however we will need to add the product categories to the widget in the admin center.

##### Navigate to the Admin center to set up the category widget 

- Admin center > Appearance > Widget > Find "Product Categories" > Drag over to "Woo Product Categories" > Select options and configurations > Click "Save"

## Custom Files

### Point of entry - passing data to the twig files

To integrate WooCommerce into our theme, we have created a file named **woocommerce.php**, place this file in the root of our **theme** folder. All WooCommerce pages will go through a file named `woocommerce.php`. This file loads two twig files  `/views/woocommerce/store-archive.twig` and `/views/woocommerce/single-product.twig`.

#### Template views

- **Store Archive** displays the product grid on the "Shop" page
  -   `/views/woocommerce/store-archive.twig`
- **Single Product** displays the product details on the single product detail page
  - `/views/woocommerce/single-product.twig`
- **Card Product** displays the products in loops
  -  `/views/partials/card-product.twig`

*Note: There are several of WooCommerce’s default hooks and comments included explaining their use, this is to keep the integration seamless and allow any of the WooCommerce extension plugin to still work.*

**Navigate to the main.twig file**

In order for the shop page to render correctly, we will need to add a block around the main content.

`/views/layouts/main.twig` 

```php
{# added this block around the main tag because woocommerce injects its own main tag #}
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

- For this step we created a new page which will act as the cart. Place the file named `template-cart.php` in the root of our **theme** folder.

- We also created a new page that will act as checkout. Place the file named `template-checkout.php` in the root of our **theme** folder.


#### **Page Views**

Those two new pages will now point to the twig files we created.

- Place the file named **cart.twig** in our views folder
  - `/views/cart.twig` 
- Then create a file named **checkout.twig** in our views folder 
  - `/views/checkout.twig` 

Now that we have our page templates and page views created and placed in the correct folders, we can set up the pages in the admin center.

**Navigate to the Admin Center**

- Pages > Hover over **Cart** > Click "Quick Edit" > Select "Woocommerce Cart" from the *Template* dropdown > Click "Update"

Do the same for the checkout page but select the "Woocommerce Checkout" template instead.

*Note: For any other pages that may need custom page templates (thank-you, my-account, etc ) create the new files and then follow the same instructions for setting up page templates.*

## Wrapping up any loose ends

Below are a few more steps needed to finish the woocommerce integration. These steps will be done in the admin center. While there are just a few extra suggestions below, you my want to spend some time digging into all of the different options/settings/configurations WooCommerce offers. Need help? WooCommerce has an extensive documentation, references, and tutorials section [here](https://docs.woocommerce.com/).

### Setting up test products

Navigate to the admin center

- Products > Click "Create Product"

- Follow the prompts

- Publish


### Other Woocommerce Settings need to be set up

- Add pages to main Nav
  
  - Admin Center > Appearance > Menus > Select the any/all Pages to be added (i.e. "Shop") > Order menu > Click "Save Menu"
- Payment Processing
- Terms and conditions (optional)
- Privacy Policy (optional)
- Taxes (optional)

  

## Updating WooCommerce

There are two option for updating WooCommerce.

- Updating from the admin center.
  - Navigate to the Plugin section in the admin center, locate the WooCommerce plugin, and click "update now"

- Downloading the plugin files from the WooCommerce website.
  - WooCommerce plugin found here:
    -  https://docs.woocommerce.com/documentation/plugins/woocommerce/
  - Create an account or login
  - Navigate to the `wp-content/plugins` folder
  - Replace the old `woocommerce` folder with the new (unzipped) `woocommerce` plugin folder here (confirm **replace all** files)

Before updating, we suggest looking over the version detail via "View Version Details" link, as to get a better idea of what changes have been made. This will give insight on testing the update. Before merging into the dev environment: check styles, checkout process, page templates, deprecated functions, etc.

**Note:** Need to take extra care when updating woocommerce as sometime woocommerce will need to update the templates we have overwritten. In that case there is documentation below on how to safely update these overwritten custom templates.

- https://docs.woocommerce.com/document/template-structure/

- https://docs.woocommerce.com/document/fix-outdated-templates-woocommerce/