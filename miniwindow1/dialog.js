
// --------------------------------------------------------------------
// class representing the xman entries grid

										// inherit the base methods and variables
dtack_miniwindow_dialog_c.prototype = new dtack_base2_c();
										/* remember who the base class is */
dtack_miniwindow_dialog_c.prototype.parent = dtack_base2_c;

// -------------------------------------------------------------------------------
// constructor

function dtack_miniwindow_dialog_c(page)
{
  var F = "dtack_miniwindow_dialog_c";
										// initilialize the base instance variables
  this.construct(page.dtack_environment, F);

  this.page = page;

} // end constructor

// -------------------------------------------------------------------------------
dtack_miniwindow_dialog_c.prototype.initialize = function(options)
{
  var F = "initialize";
    
  $("BODY").prepend("<div id=\"dtack_miniwindow_dialog\"><div class=\"_content\"></div></div>");
  
  this.$container = $("#dtack_miniwindow_dialog");
  this.$container.dialog(
    {
      "autoOpen": false,
      "autoResize": true,
      "height": "auto",
      "width": "auto"
	});

} // end method

// -------------------------------------------------------------------------------
dtack_miniwindow_dialog_c.prototype.hide = function()
{
  var F = "hide";
  
  this.$dialog.dialog("close");

} // end method

// -------------------------------------------------------------------------------
dtack_miniwindow_dialog_c.prototype.show_near = function($content, element, options)
{
  var F = "show_near";
                                    
  var method = this.option_value(options, "method", "clone");
                                     
                                        // get the content into our display container
  if (method == "clone")
  {                                    
    this.clone_content_into_container($content);
  }
  else
  if (method == "move")
  {                                    
    this.move_content_into_container($content);
  }
  else
  {
  	this.render_content_into_container($content);
  }
  
  this.extract_title();
  this.$container.dialog("option", 
    "position", 
    {
      "my": this.option_value(options, "my", "right top"), 
      "at": this.option_value(options, "at", "left top"), 
      "of": element
    }
  );
  this.$container.dialog("option", "width", this.option_value(options, "width", "auto"));
  
  this.$container.dialog("open");

} // end method

// -------------------------------------------------------------------------------
// clone the content (which includes attached events)
// watchfrog #164

dtack_miniwindow_dialog_c.prototype.clone_content_into_container = function($content)
{
  var F = "clone_content_into_container";

  this.debug(F, "cloning " + $content.length  + " jquery elements");
  
                                        // remove all child nodes from our content display area
  $("._content", this.$container).empty();
  
                                        // clone all the nodes from the target content
  $cloned_content = $content.clone(true, true);
  
                                        // un-hide the display content
  $cloned_content.show();
  
                                        // append the display content into our display area
  $("._content", this.$container).append($cloned_content);

} // end method

// -------------------------------------------------------------------------------
// move the content (which includes attached events and removes from original parent)
// watchfrog #164

dtack_miniwindow_dialog_c.prototype.move_content_into_container = function($content)
{
  var F = "move_content_into_container";

  this.debug(F, "moving " + $content.length  + " jquery elements");
  
                                        // detach all child nodes from our content display area
                                        // they can be added later
  $("._content", this.$container).children().detach();
  
                                        // un-hide the display content
  $content.show();
  
                                        // append the display content into our display area
  $("._content", this.$container).append($content);

} // end method

// -------------------------------------------------------------------------------
dtack_miniwindow_dialog_c.prototype.render_content_into_container = function($content)
{
  var F = "render_content_into_container";

  $("._content", this.$container).html($content.html());

} // end method

// -------------------------------------------------------------------------------
dtack_miniwindow_dialog_c.prototype.extract_title = function()
{
  var F = "extract_title";

  $title = $("._content ._dialog_header_text", this.$container);
  if ($title.length > 0)
  {
    this.$container.dialog("option", "title", $title.html());
  }
  else
  {
    this.$container.dialog("option", "title", "no title");
  }


} // end method

