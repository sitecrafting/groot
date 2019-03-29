<?php

/**
 * Project\Twig\TwigHelper class
 *
 * @copyright 2019 SiteCrafting, Inc.
 * @author    Coby Tamayo <ctamayo@sitecrafting.com>
 */

namespace Project\Twig;

use Conifer\Twig\HelperInterface;

/**
 * A place to put your custom Twig functions and filters.
 *
 * To add these automatically, add this to your config callback:
 *
 * ```
 * $this->add_twig_helper(new ThemeTwigHelper);
 * ```
 *
 * @see https://coniferplug.in/reference/twig-helperinterface.html
 */
class ThemeTwigHelper implements HelperInterface {
  public function get_functions() : array {
    // add your project-specific Twig functions here
    return [];
  }

  public function get_filters() : array {
    // add you project-specific Twig filters here
    return [];
  }
}
