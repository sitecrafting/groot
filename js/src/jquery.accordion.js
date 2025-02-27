/**
 * ## jQueryAccordion module Usage
 *
 * ### Markup:
 * <dl class="accordion">
 *   <dt data-id="tab1"><h3><button id="accordion_panel_title_1">Tab Title</button></h3></dt>
 *   <dd id="accordion_panel_1">Panel Content</dd>
 *   <dt data-id="tab1"><h3><button id="accordion_panel_title_2">Tab Title</button></h3></dt>
 *   <dd id="accordion_panel_2">Panel Content</dd>
 * </dl>
 *
 * ### JS:
 * $.fn.accordion = require('./jquery.accordion.js');
 * $('dl.accordion').accordion();
 */
export default (($) => {

    return function() {

        //VARIABLES
        const $tabs = $('dl.accordion dt')

        //FUNCTIONS
        const toggleAccPanelFn = function( $this_tab, $this_panel ){
            if( $this_tab.hasClass('active') && $this_panel.is(':visible') ){
                $this_panel.slideUp();
                $this_tab.removeClass('active').addClass('inactive');
                $this_tab.find('button').attr('aria-expanded', 'false');
            }
            else{
                $this_panel.slideDown();
                $this_tab.addClass('active').removeClass('inactive');
                $this_tab.find('button').attr('aria-expanded', 'true');
            }
        }

        //TAB ANCHOR CLICKS
        $tabs.find('button').on('click', function(e){
            e.preventDefault()
            const this_tab = $(this).closest('dt');
            const this_panel = this_tab.next();
            toggleAccPanelFn(this_tab, this_panel);
        });
    }

})(jQuery)
