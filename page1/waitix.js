// --------------------------------------------------------------------
// class representing the page being viewed in the browser

										// inherit the base methods and variables
dtack_page_waitix_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack_page_waitix_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
dtack_page_waitix_c.prototype.constructor = dtack_page_waitix_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack_page_waitix_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack_page_waitix_c";

										/* call the base class constructor helper */
	dtack_page_waitix_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  classname != undefined? classname: F);
  }

} // end constructor


// -------------------------------------------------------------------------------
// fog the page while loading

dtack_page_waitix_c.prototype.show_initial = function(options)
{
  var F = "initialize_and_show";
  
  this.debug_verbose(F, "initializing the dtack page base waiting indicator " + this.option_keys_text(options));
  
  //return;
  
  $("BODY").addClass("initial_body");
  
  $("BODY").append(
"<div class=\"dtack_utility_waitix_div\">\n" +
"  <div style=\"width: 100%; height: 100%\">\n" +
"      <div style=\"padding-left: 400px; padding-top: 500px;\">\n" +
"        <div id=\"dtack_utility_waiting_text_div\" style=\"padding: 4px; display: table-cell; background-color: white; font-style: italic; color: red; font-size: 12px;\"><span style=\"color: red;\">initializing...</span></div>\n" +
"      </div>\n" +
"  </div>\n" +
"</div>\n");
                                        // show waiting indicator on the page
  this.show("loading...");

} // end method

// -------------------------------------------------------------------------------
// this is called from the body onload or after all the elements are in the DOM

dtack_page_waitix_c.prototype.hide_initial = function()
{
  var F = "delay_and_hide";

  var that = this;
  
                                        // get the configured development activation delay
  delay = parseInt(
    this.dtack_environment.host_value(
      "development.delay_activation_hide", "0"));
  
  if (isNaN(delay))
    delay = 0;

  if (delay > 0)
  {
    this.debug_verbose(F, "delaying hiding waiting indicator by " + delay + " ms");
    
                                        // fix initial waitix hide to also force a resize so inner maxate div can be situated right
                                        // watchfrog #168
  	setTimeout(function() {that.hide(); $(window).resize();}, delay);
  	                                    // return after setting the timer
  	return;
  }
  
  this.hide();
                                        // fix initial waitix hide to also force a resize so inner maxate div can be situated right
                                        // watchfrog #168
  $(window).resize();
} // end method

// -------------------------------------------------------------------------------
// unfog the page now that it is loaded
// add click handler to buttons to show the fog before doing their default action

dtack_page_waitix_c.prototype.show = function(text, options)
{
  var F = "show"; 

  //return;
                                                            
  this.debug_verbose(F, "showing waiting indicator");

  $(window).resize();

                                        // put the text in the middle of the waiting display area
  $("#dtack_utility_waiting_text_div").html(text);
  
//  var window_width = $(window).width().toFixed(0);
//  var window_height = $(window).height().toFixed(0);
//                                                      
//  this.debug(F, "showing waiting indicator at window size " + window_width + "x" + window_height);

  //$(".dtack_utility_waitix_div").css({"width": window_width + "px"});
  //$(".dtack_utility_waitix_div").css({"height": window_height + "px"});

  

                                        // assign the body class which removes the scrollbars and shows the waiting area
                                        // the black/red swap thing didn't work so well in any IE browser up to 11
  //$("BODY").addClass("dtack_utility_waiting_state_class");
  $("BODY").addClass("initial_body");
  
} // end method


// ------------------------------------------------------------------------------
dtack_page_waitix_c.prototype.hide = function()
{
  var F = "hide";
                                                        
  this.debug_verbose(F, "hiding waiting indicator");
                                                                  
                                        // clear the text in the middle of the waiting display area
  $("#dtack_utility_waiting_text_div").html("");
                                        // assign the body class which removes the scrollbars and shows the waiting area
  $("BODY").removeClass("initial_body");
  //$("BODY").removeClass("dtack_utility_waiting_state_class");
  
  //alert(text);
  
}  // end method
                                                                         