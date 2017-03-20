(function($) {

  //markup:
  // <dl class="accordion">
  //      <dt data-id="tab1"><h3><a href="#tab1">Tab Title</a></h3></dt>
  //      <dd>Panel Content</dd>
  //      <dt data-id="tab1"><h3><a href="#tab2">Tab Title</a></h3></dt>
  //      <dd>Panel Content</dd>
  // </dl>

$.fn.accordion = function() {

    //VARIABLES
    var $accWrapper = $(this),
        $tabs = $accWrapper.children('dt'),
        hashtag = window.location.hash,
        panelId = window.location.hash.replace('#','');

    //FUNCTIONS
    var toggleAccPanelFn = function( $this_tab, $this_panel ){
          if( $this_tab.hasClass('active') && $this_panel.is(':visible') ){
              $this_panel.slideUp();
              $this_tab.removeClass('active').addClass('inactive');
          }
          else{
            $this_panel.slideDown();
            $this_tab.addClass('active').removeClass('inactive');
          }

    };

    //TAB ANCHOR CLICKS
    $tabs.find('a').on('click', function(e){
        e.preventDefault();
        var this_tab = $(this).parent().parent();
        var this_panel = this_tab.next();
        toggleAccPanelFn(this_tab, this_panel);
    });

    //PRESELECTED OPEN PANEL (USE OF HASHTAGS)
    if( hashtag && $accWrapper.children('dt[data-id="'+panelId+'"]').length>0 ){
        var selected_tab = $accWrapper.children('dt[data-id="'+panelId+'"]');
        var selected_panel = selected_tab.next();
        toggleAccPanelFn(selected_tab, selected_panel);

        var accordionPos = selected_tab.offset().top;
        $('html, body').animate( { scrollTop : accordionPos }, 500 );
    }
};

})(jQuery);
