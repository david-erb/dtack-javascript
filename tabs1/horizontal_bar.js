// --------------------------------------------------------------------
// class representing a DOM table

										// inherit the base methods and variables
dtack__tabs__horizontal_bar_c.prototype = new dtack_base2_c();

										// override the constructor
dtack__tabs__horizontal_bar_c.prototype.constructor = dtack__tabs__horizontal_bar_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__tabs__horizontal_bar_c(page, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__tabs__horizontal_bar_c";

	this.parent = dtack_base2_c.prototype;

	if (classname == undefined)
	  classname = F;
										// call the base class constructor helper 
	this.parent.constructor.call(this, page.dtack_environment, classname);
	
	this.page = page;
	
	this.initialization_options = new Object();
  }          
               
} // end constructor

// -------------------------------------------------------------------------------
dtack__tabs__horizontal_bar_c.prototype.initialize = function(options)
{
  var F = "initialize";

  if (options !== undefined)
    this.initialization_options = options;
  
} // end method

// -------------------------------------------------------------------------------
dtack__tabs__horizontal_bar_c.prototype.activate = function()
{
  var F = "activate";
  
  var that = this;
                                                  
  var $clickables = $(".dtack_tabs.T_bar.T_horizontal").find(".dtack_tabs.T_clickable");
  this.debug_verbose(F, "activating tabs horizontal bar for " + $clickables.length + " clickables");
  
  var location_url = location.href;
  
  $clickables.each(
    function()
    {
      var clickable_url = $(this).attr("data-dtack_tabs_url");
      if (clickable_url.substring(0, 3) == "../")
        clickable_url = clickable_url.substring(3);
      var end = location_url.substring(location_url.length - clickable_url.length);
      if (end == clickable_url)
	  {
	  	$(this).addClass("T_current");
	  }
	  else
	  {
	  	that.debug_verbose(F, "non-matching tab end " + that.vts(end));
	  }
	
	}
  );
                                        // handle click on a top level button
  $clickables.click(
    function(event)
    {
      that.handle_item_clicked(event, $(this));
	}
  );

} // end method

// ------------------------------------------------------------------------
dtack__tabs__horizontal_bar_c.prototype.handle_item_clicked = function(jquery_event_object, $item)
{
  var F = "handle_item_clicked";
  
  var url = $item.attr("data-dtack_tabs_url");
  
  this.debug(F, "clicked tab with url " + this.vts(url));
  
  if (!url)
    return;
  
  if (url.substr(0, 1) != "/" &&
      url.substr(0, 4) != "http")
  {
    var root_url = this.initialization_options["root_url"];
    if (root_url != undefined)
      url = root_url + "/" + url;
  }
    
  item_clicked_target = this.option_value(this.initialization_options, "item_clicked_target", "_self");
  
  this.page.jump(
    {
      jquery_event_object: jquery_event_object,
      url: url,
      target: item_clicked_target,
      target_shift: "_blank"
	}
  );
} // end method
