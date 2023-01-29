/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 
  ! THIS FILE IS A COMPONENT OF THE DTACK_JAVASCRIPT LIBRARY
  ! THIS FILE IS TO BE TREATED WITH "TRADE SECRET" CARE
  ! Copyright (C) 2005 Dtack Inc. All Rights Reserved
  ! To use this file, you must have signed a license agreement with Dtack Inc.
  ! Under no circumstances may you redistribute this file.
  ! This software is provided AS IS with no warranty expressed or implied.
  ! Dtack Inc. accepts no liability for use or misuse of this file.
  ! http://www.dtack.com  dtack@dtack.com  telephone +360.670.5775
  ! Dtack Inc., 1009 Homestead Ave., Port Angeles, WA USA 98362
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */

try
{
										// inherit the base methods and variables
  dtack__ajax__watcher_c.prototype = new dtack_base2_c();
										/* remember who the base class is */
  dtack__ajax__watcher_c.prototype.parent = dtack_base2_c;
}
catch(exception)
{
  if (exception.name != undefined)
	window.status = exception.name + ": " + exception.message;
  else
	window.status = exception;
}

// --------------------------------------------------------------------

function dtack__ajax__watcher_c(dtack_environment, options)
{
  var F = "dtack__ajax__watcher_c";
										// initilialize the base instance variables
  this.construct(dtack_environment, F);

  this.options = options;
  
  this.registered_start_count = 0;
  this.registered_finish_count = 0;
  this.registered_success_count = 0;
  this.registered_failure_count = 0;
  
                                        // id of the container we will use to stuff the display into
  var container_id = this.option_value(options, "container_id", "dtack__ajax__watcher_container");
  this.$dtack__ajax__watcher_container = $("#" + container_id);
  
                                        // container not in the DOM yet?
  if (this.$dtack__ajax__watcher_container.length == 0)
  {
  	                                    // add container to the DOM
    var html = "<div id=\"" + container_id + "\" class=\"T_hidden\"><div class=\"T_status\"></div></div>";
    $("BODY").append(html);
    this.$dtack__ajax__watcher_container = $("#" + container_id);
  }
    
                                        // reference the status area within the container
  this.$dtack_ajax_watcher_status = 
    $(".T_status", this.$dtack__ajax__watcher_container);

                                        // the hiding is now done by class T_hidden, which is removed to show
                                        // when printing, the div is hidden even if T_hidden is removed
                                        // watchfrog # 236
  //this.$dtack__ajax__watcher_container.hide();
    
                                        // don't show the old-fashioned update status
                                        // old projx admin templates have this in them
  $("#update_status_text").css("display", "none");
    
  //this.visualize_status("No automatic updates started.");
} // end class

// -------------------------------------------------------------------------------

dtack__ajax__watcher_c.prototype.register_start = function()
{
  var F = "register_start";

  this.registered_start_count++;
  this.visualize_status("Automatic updates pending...");

} // end method

// -------------------------------------------------------------------------------

dtack__ajax__watcher_c.prototype.register_success = function()
{
  var F = "register_success";

  this.registered_finish_count++;
  this.registered_success_count++;
  
  if (this.registered_finish_count == this.registered_start_count)
    this.visualize_status("All automatic updates complete.");
    
} // end method
                              
// -------------------------------------------------------------------------------

dtack__ajax__watcher_c.prototype.register_failure = function(details)
{
  var F = "register_failure";

  this.registered_finish_count++;
  this.registered_failure_count++;

  this.notify_failure(details);
  
  if (this.registered_finish_count == this.registered_start_count)
    this.visualize_status("All updates complete.");
  
} // end method                          
                                    
// -------------------------------------------------------------------------------

dtack__ajax__watcher_c.prototype.page_has_unfinished_ajax = function()
{
  var F = "page_has_unfinished_ajax";
  
  //this.debug(F, "ajax watcher has " + (this.registered_start_count - this.registered_finish_count) + " unfinished ajax");

  return this.registered_start_count > this.registered_finish_count;
  
} // end method
              
// ----------------------------------------------------------------------------

dtack__ajax__watcher_c.prototype.visualize_status = function(status)
{
                                        // the hiding is now done by class T_hidden, which is removed to show
                                        // when printing, the div is hidden even if T_hidden is removed
                                        // watchfrog # 236
  //this.$dtack__ajax__watcher_container.show();
  this.$dtack__ajax__watcher_container.removeClass("T_hidden");
  this.$dtack_ajax_watcher_status.html(status);
} // end method

// ----------------------------------------------------------------------------
// called with an ajax had detected any kind of error
// the theory is that failures are pervasive (not sporadic) at the server end
// so no real need for the page to recover and continue
// we just keep reporting each one as it happens with an alert

dtack__ajax__watcher_c.prototype.notify_failure = function(details)
{
  
  //this.dialog_ajax_watcher_failure(details);
 
  this.alert_failure(details);
  
} // end method

// ----------------------------------------------------------------------------

dtack__ajax__watcher_c.prototype.alert_failure = function(details)
{
  var message = 
    "Server Communications Failure\n\n" +
    "There has been an error communicating with the server.\n\n" +
    "The auto-save is no longer working, so changes you make on this page will not be saved.\n" +
    "You can try to move to another page and continue your work.\n" +
    "If this error continues on other pages, please contact Technical Support.\n\n" +
    "Here are some details:\n" +
    details;
  
  alert(message);
  
} // end method
