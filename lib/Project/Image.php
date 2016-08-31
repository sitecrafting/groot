<?php
/**
 * Manage image sizes
 */

namespace Project;

use TimberImage;

/**
 * Custom Image class for maintaining image sizes.
 * Image sizes/dimensions are more easily retrievable when declared via this class.
 *
 * @copyright 2015 SiteCrafting, Inc.
 * @author Coby Tamayo
 */
class Image extends TimberImage {
  /**
   * Image sizes declared to WordPress, including default ones
   * @var array
   */
  protected static $declared_sizes = [];

  /**
   * Thin wrapper around add_image_size(). Remembers arguments so that the newly declared size
   * can be looked up later using get_sizes().
   * @link https://developer.wordpress.org/reference/functions/add_image_size/ WordPress Codec: add_image_size
   * @param string  $name   the name of the custom size to declare
   * @param int  $width  the width to declare for this size
   * @param int  $height the height to declare for this size
   * @param boolean $crop whether to create versions of newly uploaded pics cropped to this size
   */
  public static function add_size( $name, $width, $height, $crop = false ) {
    add_image_size( $name, $width, $height, $crop );
    $declared_sizes[$name] = [
      'name'    => $name,
      'width'   => $width,
      'height'  => $height,
      'crop'    => $crop,
    ];
  }

  /**
   * Get all images sizes, including default ones
   * @return array
   */
  public static function get_sizes() {
    $sizes = [
      'thumbnail' => [
        'name'    => 'thumbnail',
        'width'   => get_option('thumbnail_size_w'),
        'height'  => get_option('thumbnail_size_h'),
      ],
      'medium'    => [
        'name'    => 'medium',
        'width'   => get_option('medium_size_w'),
        'height'  => get_option('medium_size_h'),
      ],
      'medium_large' => [
        'name'    => 'medium_large',
        'width'   => get_option('medium_large_size_w'),
        'height'  => get_option('medium_large_size_h'),
      ],
      'large'     => [
        'name'    => 'large',
        'width'   => get_option('large_size_w'),
        'height'  => get_option('large_size_h'),
      ],
    ];

    if (!isset(static::$declared_sizes['thumbnail'])) {
      // default sizes aren't all set; set them now
      static::$declared_sizes = array_merge(static::$declared_sizes, $sizes);
    }

    return static::$declared_sizes;
  }

  /**
   * Get dimension info for the custom image size $size
   * @param  array $size an array containing at least: "name", "width", and "height".
   * @return array
   */
  public static function get_size( $size ) {
    $sizes = static::get_sizes();

    if (isset($sizes[$size])) {
      return $sizes[$size];
    }
  }

  /**
   * Get the declared width of this image, optionally specific to the image size $size
   * @param  string $customSize if specified
   * @return int
   */
  public function get_width( $customSize = false ) {
    if ($customSize && $dimensions = static::get_size($customSize)) {
      $width = $dimensions['width'];
    } else {
      $width = parent::get_width();
    }

    return $width;
  }

  /**
   * Get the declared height of this image, optionally specific to the image size $size
   * @param  string $customSize if specified
   * @return int
   */
  public function get_height( $customSize = false ) {
    $originalWidth = parent::get_width();
    $width = $this->get_width($customSize);

    if ($width != $originalWidth) {
      // distinct custom dimensions; calculate new based on aspect ratio
      $height = floor( $width / $this->aspect() );
    } else {
      // not a custom size; just return the original height
      $height = parent::get_height();
    }

    return $height;
  }
}
