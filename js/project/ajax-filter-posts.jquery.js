(function($) {

/**
 * Constructor that drives the behavior of the $.ajaxFilterPosts jQuery extension.
 * @param {Object} element the jQuery/DOM element to attach our main event listeners to
 * @param {Object} options plain object of options. TODO: document these options
 */
function AjaxFilterPostLoader(element, options) {
  var self = this;

  this.events = {
    lazy_load:          'ajax_filter_posts:lazy_load',
    lazy_load_result:   'ajax_filter_posts:lazy_load_result',
    filter_changed:     'ajax_filter_posts:filter_changed',
    filter_navigated:   'ajax_filter_posts:filter_navigated',
    filter_result:      'ajax_filter_posts:filter_result',
  };

  this.$element               = $(element);
  this.$container             = $(options.container);
  this.endpoint               = options.endpoint;
  this.filters                = options.filters;
  this.lazyLoad               = options.lazyLoad;
  this.loadingState           = options.loadingState || 'loading'; // TODO loadingState as a callback
  this.noMoreMessage          = options.noMoreMessage;
  this.noPostsMessage         = options.noPostsMessage;
  this.postsLoadedSelector    = options.postsLoadedSelector;

  this.postsPerPage           = options.postsPerPage || 10;
  this.currentOffset          = this.postsPerPage;
  this.offsetParamName        = options.offsetParamName || 'offset';

  if (options.loadErrorCallback) {
    this.loadErrorCallback = options.loadErrorCallback;
  } else {
    this.loadErrorCallback = function(xhr, status, err) {
      console.log('request to '+self.endpoint+' failed:', xhr, status, err);
    };
  }

  this._loading = false;
  this._postsExhausted = false;
  this.$window = $(window);

  this.init = function() {
    // Initialize filter objects and register filter change event handlers
    this.filters = this.filters.map(function(filterConfig) {
      // get a jQuery element for this filter
      var $element = $(filterConfig.selector);

      // register change event listener for this filter
      $element.change(function() {
        filterConfig.value = $element.val();
        self.$element.trigger(self.events.filter_changed, self.getFilterValues());
      });

      // make this element available later
      filterConfig.$element = $element;
      filterConfig.value = $element.val();
      return filterConfig;
    });
    // set default filters to configured value,
    // or the current filters if no filterDefaults was specified
    this.filterDefaults = options.filterDefaults || this.filters;

    // filter selection change callback
    this.$element.on(this.events.filter_changed, function(e, filters) {
      self.loadPosts(filters, self.events.filter_result);
      self.pushState(filters);
    });

    // filter change resulting from back/forward history navigation
    this.$element.on(this.events.filter_navigated, function(e, filters) {
      self.loadPosts(filters, self.events.filter_result);
    });
    // respond to push/pop state events by reloading filters
    window.onpopstate = function(e) {
      var filters;
      
      if (e.state && e.state.filters) {
        // user navigatied back/forward to a specific filter set
        filters = e.state.filters;
      } else {
        filters = self.getFilterValues(this.filterDefaults);
      }
      
      self.loadPosts(filters, self.events.filter_result);
      self.updateFilterElements(filters);
    };

    // AJAX result callback
    this.$element.on(this.events.filter_result, function(e, result) {
      self.refreshPosts(result);
    });

    if (this.lazyLoad && this.lazyLoad.type === 'scroll_past') {
      // TODO allow user-specified lazy-load hook
      this.$window.scroll(function() {
        // compare y-offset of the bottom of $container to the bottom of the window
        var c = self.$container,
            w = self.$window;

        if (!(self._loading || self._postsExhausted) && // there may be posts to load
              $(self.postsLoadedSelector).length > 0 && // we have loaded posts previously
              c.offset().top + c.height() < w.height() + w.scrollTop()) { // user scrolled past the container

          // trigger lazy-load event
          self.$element.trigger(self.events.lazy_load, self.getFilterValuesWithOffset());
        }
      });
    }
    // TODO add "load more" button type

    if (!this.anyPostsLoaded()) {
      this._postsExhausted = true;
    }

    this.$element.on(this.events.lazy_load, function(e, filters) {
      self.loadPosts(filters, self.events.lazy_load_result);
    });

    this.$element.on(this.events.lazy_load_result, function(e, result) {
      self.appendPosts(result);
    });
  };

  /**
   * Get the current filters values as a key/value pairs
   * @param  {Object} filters the internal
   * @return {Object}         a plain object; key/value pairs for each filter
   */
  this.getFilterValues = function(filters) {
    if (!filters) {
      // default to current filters
      filters = this.filters;
    }

    return filters.reduce(function(filterValues, filter) {
      filterValues[filter.name] = filter.value;
      return filterValues;
    }, {});
  };

  /**
   * Get key/value pairs for the current filters
   * @return {Object} plain object representing the current filters
   */
  this.getFilterValuesWithOffset = function() {
    var values = this.getFilterValues();
    values[this.offsetParamName] = this.currentOffset;
    return values;
  };

  /**
   * Update the filter elements in the DOM to reflect the requested filter parameters
   * @param  {Object} requestFilters plain object of key/value pairs for the requested filters
   */
  this.updateFilterElements = function(requestFilters) {
    this.filters.forEach(function(filter) {
      if (requestFilters.hasOwnProperty(filter.name)) {
        filter.$element.val(requestFilters[filter.name]);
      }
    });
  };

  /**
   * Load posts matching the current filters from the configured endpoint
   * @param  {Object} filters            the filters to send to the endpoint as GET params
   * @param  {String} completedEventName the event to trigger when the AJAX request completes
   */
  this.loadPosts = function(filters, completedEventName) {
    var self = this;

    this.applyLoadingState();
    this._postsExhausted = false;

    $.ajax({
      type: 'GET',
      url: this.endpoint,
      data: filters,
      success: function(result) {
        self.$element.trigger(completedEventName, [result, filters]);
      },
      error: function(xhr, status, err) {
        self.loadErrorCallback.call(self, xhr, status, err);
      },
    });
  };

  /**
   * Append lazy-loaded posts' HTML to the post content container
   * @param  {Object} result object whose "html" property is a valid (string/jQuery) parameter to $.append()
   */
  this.appendPosts = function(result) {
    if (result.post_count > 0) {
      // append post content to posts container
      this.$container.append(result.html);

      // increment our posts offset parameter by postsPerPage
      this.currentOffset += this.postsPerPage;
    }

    if (result.post_count < this.postsPerPage) {
      // we've loaded less than a full "page" of posts:
      // show "no more posts" message
      this.$container.append(this.lazyLoad.noMoreMessage);

      // don't try to load any more posts with the current filters
      this._postsExhausted = true;
    }

    this.revokeLoadingState();
  };

  /**
   * Replace the content of the post content container with the latest filter results HTML
   * @param  {Object} result plain object whose "html" property is a valid (string/jQuery) parameter to $.html()
   */
  this.refreshPosts = function(result) {
    if (result.post_count > 0) {
      // wipe out the previously displayed posts and display the newly loaded ones
      this.$container.html(result.html);

      if (result.post_count < this.postsPerPage) {
        // we've loaded at least one post but less than a full "page":
        // show "no more posts" message
        this.$container.append(this.lazyLoad.noMoreMessage);

        // dont' try to load any more posts with the current filters
        this._postsExhausted = true;
      }
    } else {
      // display the "no posts to display" message
      this.$container.html(this.noPostsMessage);
    }

    this.revokeLoadingState();
  };

  /**
   * Indicate to the user that the 
   * @return {[type]} [description]
   */
  this.applyLoadingState = function() {
    this.$container.addClass(this.loadingState);
    this.$element.addClass(this.loadingState);
    this._loading = true;
  };

  /**
   * Indicate to the user that the filter request has completed.
   */
  this.revokeLoadingState = function() {
    this.$container.removeClass(this.loadingState);
    this.$element.removeClass(this.loadingState);
    this._loading = false;
  };

  /**
   * Whether any posts were loaded as a result of the last filter request.
   * @return {Boolean}
   */
  this.anyPostsLoaded = function() {
    return this.getNumPostsLoaded() > 0;
  };

  /**
   * Get the number of posts loaded during the last filter request.
   * @return {Number} the number of posts, based on postsLoadedSelector option
   */
  this.getNumPostsLoaded = function() {
    return $(this.postsLoadedSelector).length;
  };

  /**
   * Push a record of the current filters onto the browser history, so we can restore them
   * upon back/forward nav events
   * @param  {Object} requestFilters plain object of key/value filter pairs, e.g. category: 'uncategorized'
   */
  this.pushState = function(requestFilters) {
    // construct pushState history and push it onto the window's history
    var path = window.location.pathname+'?'+$.param(requestFilters);
    // persist these request filters in the browser history
    window.history.pushState({filters: requestFilters}, '', path);
  };
}

$.fn.ajaxFilterPosts = function(options) {
  var loader = new AjaxFilterPostLoader(this, options);
  loader.init();
  this.ajaxFilterPosts = loader;
  return this;
};

})(jQuery);
