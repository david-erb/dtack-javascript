// this object represents a idlewatcher which tracks page interaction and logs person out after warning after timeout
// watchfrog #156

										// inherit the base methods and variables
dtack_idlewatcher_c.prototype = new dtack_base2_c();
										/* remember who the base class is */
dtack_idlewatcher_c.prototype.parent = dtack_base2_c;

// --------------------------------------------------------------------

function dtack_idlewatcher_c(dtack_environment, options)
{
  var F = "dtack_idlewatcher_c";
										// initilialize the base instance variables
  this.construct(dtack_environment, F);
                                   
  this.push_class_hierarchy(F);

  this.options = options;
  
  this.logout_function = undefined;

  this.idle_seconds = 0;
  this.tick_timer = undefined;
  this.popup_seconds = 600;
  this.logout_seconds = 60;
  this.initial_container_mode = "hidden";
  this.should_reset_on_mousemove = "no";
  
  this.modal_dialog = null;
  
  this.is_activated = false;
} // end class

// -------------------------------------------------------------------------------

dtack_idlewatcher_c.prototype.initialize = function(options)
{
  var F = "initialize";
                    
  var that = this;
  
  this.popup_seconds = parseInt(this.option_value(options, "popup_seconds", this.popup_seconds));
  this.logout_seconds = parseInt(this.option_value(options, "logout_seconds", this.logout_seconds));
  this.initial_container_mode = this.option_value(options, "initial_container_mode", this.initial_container_mode);
  this.should_reset_on_mousemove = this.option_value(options, "should_reset_on_mousemove", this.should_reset_on_mousemove);
	       
} // end method

// -------------------------------------------------------------------------------

dtack_idlewatcher_c.prototype.activate = function(options)
{
  var F = "activate";

                                        // avoid activating twice
                                        // this can happen if host.idlewatcher.should_activate=yes,
                                        // indicating automatically activate on all pages,
                                        // and then and individual page class also activates specifically
  if (this.is_activated)
    return;
    
  this.is_activated = true;
    
  this.html = 
    "<div class=\"dtack_idlewatcher_container\">\n" +
    "<div class=\"_minimized\">" +
    "  <div class=\"_normal_button\"></div>\n" +
    "</div>\n" +
    "<div class=\"_normal\">" +
    "  <div class=\"_minimize_button\"></div>\n" +
    "  <div class=\"_title\">Idle Watcher</div>\n" +
    "  <div class=\"_watching\">idle for <span class=\"_count\">0</span> seconds</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div class=\"dtack_idlewatcher_modal\">\n" +
    "<div class=\"_guts\">\n" +
    "<div class=\"_message\">\n" +
    "  Your session will expire in <span class=\"_count\">&nbsp;&nbsp;</span> seconds unless you click " +
    (this.is_affirmative_value(this.should_reset_on_mousemove)? " or move": "") +
    " the mouse or touch the screen." +
    "</div>\n" +
    "</div>\n" +
    "</div>\n";
    
  $("BODY").append(this.html);
  $(".dtack_idlewatcher_container").addClass("ui-corner-all");
  $(".dtack_idlewatcher_container").draggable();

  $("DIV.dtack_idlewatcher_container ._minimize_button").click(function(jquery_event_object) {that.poke_container_mode("minimized"); return false;});
  $("DIV.dtack_idlewatcher_container ._normal_button").click(function(jquery_event_object) {that.poke_container_mode("normal"); return false;});

  this.poke_container_mode(this.initial_container_mode);
  
  var that = this;
  
  this.tick_timer = setInterval(function() {that.tick()}, 1000);
  
                                        // enhance the timeout reset with option to enable mousemove reset
                                        // watchfrog #240
  if (this.is_affirmative_value(this.should_reset_on_mousemove))
    $(document).mousemove(function(jquery_event_object) {that.reset("document.mousemove");});
  $(document).mousedown(function(jquery_event_object) {that.reset("document.mousedown");});
  $(document).keypress(function(jquery_event_object) {that.reset("document.keypress");});
  $(document).on({"touchstart": function() {that.reset("document.touchstart");}});
  $(document).on({"touchmove": function() {that.reset("document.touchmove");}});
} // end method
           

// -------------------------------------------------------------------------------

dtack_idlewatcher_c.prototype.poke_logout_function = function(logout_function)
{
  var F = "poke_logout_function";
  
  this.logout_function = logout_function;
	       
} // end method

// ----------------------------------------------------------------------------

dtack_idlewatcher_c.prototype.poke_container_mode = function(container_mode)
{
  this.container_mode = container_mode;
  
  switch(container_mode)
  {
  	case "hidden":
      $("DIV.dtack_idlewatcher_container").hide();
  	break;
  	case "normal":
      $("DIV.dtack_idlewatcher_container ._minimized").hide();
      $("DIV.dtack_idlewatcher_container ._normal").show();
  	break;
  	case "minimized":
      $("DIV.dtack_idlewatcher_container ._minimized").show();
      $("DIV.dtack_idlewatcher_container ._normal").hide();
  	break;
  }
} // end method

// ----------------------------------------------------------------------------

dtack_idlewatcher_c.prototype.tick = function()
{
  this.idle_seconds++;
  
  this.update_display();
  
  //setTimeout(function() {that.tick()}, 1000)
  
} // end method

// ----------------------------------------------------------------------------

dtack_idlewatcher_c.prototype.update_display = function()
{
  $(".dtack_idlewatcher_container ._count").html(this.idle_seconds);
  
  if (this.idle_seconds == this.popup_seconds)
    this.warn();
  else                                                     
  if (this.idle_seconds >= this.popup_seconds + this.logout_seconds)
  {
  	                                    // call the provided logout callback
  	if (this.logout_function !== undefined)
  	{
  	  (this.logout_function)();
	}
	                                    // stop counting the timer ticks
  	clearInterval(this.tick_timer);
  }
  else
  if (this.idle_seconds >= this.popup_seconds)
  {
    $(".dtack_idlewatcher_modal ._count").html(this.logout_seconds - (this.idle_seconds - this.popup_seconds));
  }

} // end method

// ----------------------------------------------------------------------------

dtack_idlewatcher_c.prototype.reset = function(cause)
{
  var F = "reset";
  
  if (this.reset_counter === undefined)
    this.reset_counter = 0;
    
  if (this.reset_counter++ < 200)
  {
    this.debug_verbose(F, this.reset_counter + ". reset because " + cause);
  }
  
  this.idle_seconds = 0;
  
  if (this.modal_dialog !== null &&
      this.modal_dialog.dialog("isOpen"))
  {
  	this.modal_dialog.dialog("close");
  }
  
} // end method

// ----------------------------------------------------------------------------

dtack_idlewatcher_c.prototype.warn = function()
{
  var F = "warn";
  
  if (this.modal_dialog == null)
  {
  
    this.modal_dialog = $(".dtack_idlewatcher_modal");
    this.modal_dialog.dialog(
      {
        "autoOpen": false,
        "autoResize": true,
        "title": "Idle Time Warning",
        "modal": true,
        "height": "auto",
        "width": "auto"
	  });
	  
	this.debug(F, "creating the modal dialog");
  	
  }

  this.modal_dialog.dialog("open");
  this.modal_dialog.dialog("moveToTop");
  
} // end method
