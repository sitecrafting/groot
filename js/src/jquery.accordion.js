/**
 * ## jQueryAccordion module Usage
 *
 * ### Markup:
 * <dl class="accordion">
 *   <dt data-id="tab1"><h3><a href="#tab1">Tab Title</a></h3></dt>
 *   <dd>Panel Content</dd>
 *   <dt data-id="tab1"><h3><a href="#tab2">Tab Title</a></h3></dt>
 *   <dd>Panel Content</dd>
 * </dl>
 *
 * ### JS:
 * $.fn.accordion = require('./jquery.accordion.js');
 * $('dl.accordion').accordion();
 */
export default (($) => {

  return function() {

    //VARIABLES
    const $tabs = $('dl.accordion dt'),
        hashtag = window.location.hash,
        panelId = window.location.hash.replace('#','');

    //FUNCTIONS
    const toggleAccPanelFn = function( $this_hash, $this_tab, $this_panel ){
      if( $this_tab.hasClass('active') && $this_panel.is(':visible') ){
        $this_panel.slideUp();
        $this_tab.removeClass('active').addClass('inactive');
      }
      else{
        $this_panel.slideDown();
        $this_tab.addClass('active').removeClass('inactive');
        window.location.hash = $this_hash;
      }

    }

    //TAB ANCHOR CLICKS
    $tabs.find('a').on('click', function(e){
      e.preventDefault()
      const this_hash = $(this).attr('href');
      const this_tab = $(this).closest('dt');
      const this_panel = this_tab.next();

      toggleAccPanelFn(this_hash, this_tab, this_panel);
    });

    //PRESELECTED OPEN PANEL (USE OF HASHTAGS)
    if( hashtag && $('dl.accordion dt[data-id="'+panelId+'"]').length>0 ){
      
      const selected_tab = $('dl.accordion dt[data-id="'+panelId+'"]');
      const selected_panel = selected_tab.next();
      const accordionPos = selected_tab.offset().top;
      
      //open panel
      toggleAccPanelFn(hashtag, selected_tab, selected_panel)

      //set scroll position to the open accordion panel
      $(document).scrollTop(accordionPos);
      //$('html, body').animate({ scrollTop: accordionPos }, 500);

    }
  }

})(jQuery)
