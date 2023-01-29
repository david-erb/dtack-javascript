// --------------------------------------------------------------------
// class representing the page being viewed in the browser

										// inherit the base methods and variables
dtack__dom__collapser_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack__dom__collapser_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
dtack__dom__collapser_c.prototype.constructor = dtack__dom__collapser_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__dom__collapser_c(page_object, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__dom__collapser_c";
	
    this.page_object = page_object;

										/* call the base class constructor helper */
	dtack__dom__collapser_c.prototype.base.constructor.call(
	  this,
	  page_object.dtack_environment,
	  classname != undefined? classname: F);
                                        // push the class hierarchy so debug_verbose may be used
	this.push_class_hierarchy(F);
               
    this.CONSTANTS = {};
    this.CONSTANTS.EVENTS = {};
    this.CONSTANTS.EVENTS.COLLAPSED = "dtack__dom__collapser_c::CONSTANTS.EVENTS.COLLAPSED";
    this.CONSTANTS.EVENTS.EXPANDED = "dtack__dom__collapser_c::CONSTANTS.EVENTS.EXPANDED";
    
    this.CONSTANTS.VISIBLE_STATUS = {};
    this.CONSTANTS.VISIBLE_STATUS.SUCCESS = "success";
    this.CONSTANTS.VISIBLE_STATUS.WARNING = "warning";
    this.CONSTANTS.VISIBLE_STATUS.FAILURE = "failure";
    
    this.pairs = new Object();
  }
  
} // end constructor


// -------------------------------------------------------------------------------
// this can be called in the head, possibly before any dom elements are loaded

dtack__dom__collapser_c.prototype.initialize = function(options)
{
  var F = "dtack__dom__collapser_c::initialize";

} // end function

// -------------------------------------------------------------------------------
// when preparing for PDF, disable all collapser styling in the event handling
dtack__dom__collapser_c.prototype.prepare_for_pdf = function()
{
  var F = "prepare_for_pdf";
  
  $(".dtack_collapsible").removeClass("dtack_collapsible");
  
  for(var k in this.pairs)
  {
    var pair = this.pairs[k];
    
    pair.$clickbar.removeClass("dtack_collapsible");
  }

} // end function

// -------------------------------------------------------------------------------
dtack__dom__collapser_c.prototype.activate = function(options)
{
  var F = "activate";

  var that = this;

  var user_preference_values = dtack_environment.host_value("user_preferences.values");
  
  if (!user_preference_values)
  {
  	this.debug(F, "not activating collapser because no user user_preference_values");
    $(".dtack_collapsible").removeClass("dtack_collapsible");
  	return;
  }
    
  $(".dtack_collapsible.T_clickbar").click(
    function(event)
    {
      that.handle_click($(this));
	}
  );
    
  $(".dtack_collapsible.T_clickbar").each(
    function()
    {
      var $clickable = $(this);
      var id = $clickable.attr("id");
      var user_preference_value = user_preference_values[id + " " + "dtack__dom__collapser-is_collapsed"];
      var is_collapsed = that.is_affirmative_value(user_preference_value);
      if (is_collapsed)
      {
  	    that.collapse($clickable);
	  }
      else
      {
  	    that.expand($clickable);
	  }
	}
  );
  
} // end method

// -------------------------------------------------------------------------------
dtack__dom__collapser_c.prototype.activate_pair = function(id, $clickbar, $contents)
{
  var F = "activate_pair";

  var that = this;
                                        // imbue the pair of objects with identifying information
  $clickbar.attr("id", id);
  $clickbar.addClass("dtack_collapsible T_clickbar");
  
  $contents.attr("id", id);
  $contents.addClass("dtack_collapsible T_contents");
  
                                        // handle click on the clickable part
  $clickbar.click(
    function(event)
    {
      that.handle_click($clickbar);
	}
  );
    
                                        // preassign the collapsed state from user preferences
  var user_preference_value = dtack_environment.host_value("user_preferences.values[" + id + " " + "dtack__dom__collapser-is_collapsed]");
  var is_collapsed = that.is_affirmative_value(user_preference_value);
  if (is_collapsed)
  {
    that.collapse($clickbar);
  }
  else
  {
    that.expand($clickbar);
  }
  
} // end method

// -------------------------------------------------------------------------------
dtack__dom__collapser_c.prototype.handle_click = function($clickable)
{
  var F = "handle_click";
  
  this.toggle($clickable, {should_update_user_preferences: "yes"});
    
} // end function

// -------------------------------------------------------------------------------
dtack__dom__collapser_c.prototype.is_collapsed = function($clickable)
{
  var F = "is_collapsed";
  
  var is_collapsed = $clickable.data("dtack__dom__collapser-is_collapsed");
  
  return this.is_affirmative_value(is_collapsed);
  
} // end function

// -------------------------------------------------------------------------------
dtack__dom__collapser_c.prototype.render = function($clickable)
{
  var F = "render";
  
  if (this.is_collapsed($clickable))
  	this.collapse($clickable);
  else
  	this.expand($clickable);
  
} // end function

// -------------------------------------------------------------------------------
dtack__dom__collapser_c.prototype.toggle = function($clickable, options)
{
  var F = "toggle";
  
  this.debug_verbose(F, "toggling " + $clickable.attr("id"));
  
  if (this.is_collapsed($clickable))
    this.expand($clickable, options);
  else
    this.collapse($clickable, options);
  
} // end function

// -------------------------------------------------------------------------------
dtack__dom__collapser_c.prototype.collapse = function($clickable, options)
{
  var F = "collapse";
  
  var id = $clickable.attr("id");

  var was_collapsed = this.is_collapsed($clickable);
  
  this.debug_verbose(F, "collapsing " + $clickable.attr("id"));
  
  var $contents = $("#" + id + ".dtack_collapsible.T_contents");

  $clickable.data("dtack__dom__collapser-is_collapsed", "yes");
  $clickable.addClass("T_is_collapsed");
  
  if (this.is_affirmative_option(options, "should_update_user_preferences"))
  {
    this.page_object.update_user_preference(
      id + " " + "dtack__dom__collapser-is_collapsed", 
      "yes");
      
                                        // add the final collapsed style after the slide is finished
    $contents.slideUp(400, function() {$(this).addClass("T_is_collapsed");});
  }
                                        // this is a programmatic collapse?
  else
  {
    if (this.is_affirmative_option(options, "should_slide"))
    {
      $contents.slideUp(400, function() {$(this).addClass("T_is_collapsed");});
    }
    else
    {
                                        // remove the collapsed style before starting the slide down
      $contents.addClass("T_is_collapsed");
    }
  }
  
  if (!was_collapsed)    
    this.pull_triggers(
      this.CONSTANTS.EVENTS.COLLAPSED, $clickable);
  
} // end function

// -------------------------------------------------------------------------------
dtack__dom__collapser_c.prototype.expand = function($clickable, options)
{
  var F = "expand";
  
  var id = $clickable.attr("id");

  var was_collapsed = this.is_collapsed($clickable);

  this.debug_verbose(F, "expanding " + $clickable.attr("id"));
  
  var $contents = $("#" + id + ".dtack_collapsible.T_contents");

  $clickable.data("dtack__dom__collapser-is_collapsed", "no");
  $clickable.removeClass("T_is_collapsed");
                         
  if (this.is_affirmative_option(options, "should_update_user_preferences"))
  {
    this.page_object.update_user_preference(
      id + " " + "dtack__dom__collapser-is_collapsed", 
     "no");
     
     $contents.slideDown(400, function() {$(this).removeClass("T_is_collapsed");});
  }
                                        // this is a programmatic collapse?
  else
  {
    if (this.is_affirmative_option(options, "should_slide"))
    {
      $contents.slideDown(400, function() {$(this).removeClass("T_is_collapsed");});
    }
    else
    {
                                        // remove the collapsed style before starting the slide down
      $contents.removeClass("T_is_collapsed");
    }
  }

  if (was_collapsed)
    this.pull_triggers(
      this.CONSTANTS.EVENTS.EXPANDED, $clickable);

} // end function
                                                                                    
                                       
                                       