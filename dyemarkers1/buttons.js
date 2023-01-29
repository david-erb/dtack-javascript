// --------------------------------------------------------------------
// class representing a DOM table

										// inherit the base methods and variables
dtack__dyemarkers__buttons_c.prototype = new dtack_base2_c();

										// override the constructor
dtack__dyemarkers__buttons_c.prototype.constructor = dtack__dyemarkers__buttons_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__dyemarkers__buttons_c(page_object, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__dyemarkers__buttons_c";

	this.parent = dtack_base2_c.prototype;

	if (classname == undefined)
	  classname = F;
	
	this.page_object = page_object;
	
										// call the base class constructor helper 
	this.parent.constructor.call(this, page_object.dtack_environment, classname);
	
                                        // push the class hierarchy so debug_verbose may be used
	this.push_class_hierarchy(F);
	                                                               
	this.list = new Object();
	
	this.most_recently_serialized = undefined;
  }                       
} // end constructor
                                                       
// -------------------------------------------------------------------------------
dtack__dyemarkers__buttons_c.prototype.initialize = function(options)
{
  var F = "initialize";

} // end method

// -------------------------------------------------------------------------------
dtack__dyemarkers__buttons_c.prototype.activate = function()
{
  var F = "activate";
  
  this.discover();
                                        // there is no pink stuff, or pink stuff contains no dyemarkers?
  if (this.$dyemarkers.length == 0)
  {
                                        // don't bother to show the all/none buttons 
    return;
  }
  
  this.$container.before("<div id=\"dtack_dyemarker_buttons\"></div>");
  this.$buttons = $("#dtack_dyemarker_buttons");
  var button_types = {};
  
  var that = this;
  
  this.$dyemarkers.each(
    function()
    {
      var type = $(this).html();
      if (type == "&nbsp;")
        type = "UNDYED";

      if (!button_types[type])
      {
        var css_class = "T_" + type;
        var user_preferences_variable =  "user_preferences.values.dyemarker_" + type;
        var user_preferences_value =  that.host_value(user_preferences_variable);
        
        if (user_preferences_value === undefined)
        {
          user_preferences_value =  that.host_value("user_preferences.defaults.dyemarker_" + type);
          that.debug_verbose(F, user_preferences_variable + " value from defaults is " + that.vts(user_preferences_value));
		}
		else
		{
           that.debug_verbose(F, user_preferences_variable + " value for page is " + that.vts(user_preferences_value));
		}
        
        if (user_preferences_value == "hide")
        {
          css_class += " T_hiding";
          that.toggle(type == "UNDYED"? "empty": type);
		}
        that.$buttons.append("<div class=\"dyemarker T_button " + css_class + "\">" + type + "</div>");
        button_types[type] = 1;
	  }
	  else
	  {
        button_types[type]++;
	  }
	}
  );

  //this.$buttons.append("<div class=\"dyemarker T_button T_UNDYED\">UNDYED</div>");
  
  $(".dyemarker.T_button", this.$buttons).click(
    function()
    {
      var dyemarker_type = $(this).html();
      $(this).toggleClass("T_hiding");
  	  if (dyemarker_type == "UNDYED")
	    that.toggle("empty");
	  else
  	    that.toggle(dyemarker_type);

      that.send_update(dyemarker_type, $(this).hasClass("T_hiding")? "hide": "show");
	
    }
  );

  this.$buttons.append("<div class=\"dyemarker T_control T_ALL\" title=\"show all\">ALL</div>");
  this.$buttons.append("<div class=\"dyemarker T_control T_NONE\" title=\"hide all\">NONE</div>");
  this.$buttons.append("<div class=\"dyemarker T_control T_LOAD\" title=\"load from defaults\">&laquo;</div>");
  this.$buttons.append("<div class=\"dyemarker T_control T_SAVE\" title=\"save as defaults\">&raquo;</div>");
  
  $(".dyemarker.T_control.T_ALL", this.$buttons).click(function() {that.show_all();});
  $(".dyemarker.T_control.T_NONE", this.$buttons).click(function() {that.show_none();});
  $(".dyemarker.T_control.T_SAVE", this.$buttons).click(function() {that.save();});
  $(".dyemarker.T_control.T_LOAD", this.$buttons).click(function() {that.load();});

} // end method

// -------------------------------------------------------------------------------
dtack__dyemarkers__buttons_c.prototype.discover = function()
{
  var F = "discover";
  
  this.$container = $("#dttracker_table");
  this.$container_rows = this.$container.children("TBODY").children();
  this.$dyemarkers = $(".dyemarker", this.$container);
  
  this.debug_verbose(F, "discovered " + this.$container.length + " pink stuff container");
  this.debug_verbose(F, "discovered " + this.$dyemarkers.length + " dyemarkers in the pink stuff");

} // end method
                                                                                             
// -------------------------------------------------------------------------------
dtack__dyemarkers__buttons_c.prototype.show_all = function()
{
  var F = "show_all";
  
  this.$container_rows.show();
  $(".dyemarker.T_button", this.$buttons).removeClass("T_hiding");
  
  var that = this;
  
  $(".dyemarker.T_button", this.$buttons).each(
    function()
    {
      var dyemarker_type = $(this).html();
      that.send_update(dyemarker_type, "show");
    }
  );
                                                                      
} // end method

// -------------------------------------------------------------------------------
dtack__dyemarkers__buttons_c.prototype.show_none = function()
{
  var F = "show_none";
  
  this.$container_rows.hide();
  $(".dyemarker.T_button", this.$buttons).addClass("T_hiding");
  
  var that = this;
  
  $(".dyemarker.T_button", this.$buttons).each(
    function()
    {
      var dyemarker_type = $(this).html();
      that.send_update(dyemarker_type, "hide");
    }
  );

} // end method
                                           
// -------------------------------------------------------------------------------
// load defaults into current page, save defaults as values for current page

dtack__dyemarkers__buttons_c.prototype.load = function()
{
  var F = "load";
  
  var that = this;
  
  $(".dyemarker.T_button", this.$buttons).each(
    function()
    {
      var dyemarker_type = $(this).html();
      var default_preferences_value =  that.host_value("user_preferences.defaults.dyemarker_" + dyemarker_type);
        
	  if (default_preferences_value === undefined)
	  {
        that.debug(F, dyemarker_type + " default value is " + that.vts(default_preferences_value));
	  }
	  else
	  {
        var current_value = $(this).hasClass("T_hiding")? "hide": "show";
      
        if (current_value != default_preferences_value)
        {
          if (default_preferences_value == "show")
          {
            that.show(dyemarker_type);
            $(this).removeClass("T_hiding");
          }
          else
          if (default_preferences_value == "hide")
          {
            that.hide(dyemarker_type);
            $(this).addClass("T_hiding");
          }

          that.send_update(dyemarker_type, default_preferences_value);
	    }
	    else
	    {
	      that.debug(F, dyemarker_type + " current value " + that.vts(current_value) + " is already the default");
		}
	  }
    }
  );

} // end method


// -------------------------------------------------------------------------------
dtack__dyemarkers__buttons_c.prototype.save = function()
{
  var F = "save";
  
  var that = this;
  
  var options = {page_name: "default"};
  
  $(".dyemarker.T_button", this.$buttons).each(
    function()
    {
      var dyemarker_type = $(this).html();
      var current_value = $(this).hasClass("T_hiding")? "hide": "show";
      var default_preferences_value =  that.host_value("user_preferences.defaults.dyemarker_" + dyemarker_type);
      
      if (current_value != default_preferences_value)
      {
      	that.debug_verbose(F, dyemarker_type + " current value " + that.vts(current_value) + " is different from default preferences value " + that.vts(default_preferences_value));
        that.send_update(dyemarker_type, current_value, options);
	  }
    }
  );

} // end method

// -------------------------------------------------------------------------------
dtack__dyemarkers__buttons_c.prototype.toggle = function(dyemarker_type)
{
  var F = "toggle";
  
  var $dyemarkers = this.$dyemarkers.filter(".T_" + dyemarker_type);
  
  this.debug_verbose(F, "toggling " + $dyemarkers.length + " dyemarkers of type " + this.vts(dyemarker_type));
  
  $dyemarkers.closest("TR").toggle();

} // end method


// -------------------------------------------------------------------------------
dtack__dyemarkers__buttons_c.prototype.show = function(dyemarker_type)
{
  var F = "show";
  
  var $dyemarkers = this.$dyemarkers.filter(".T_" + dyemarker_type);
  
  this.debug_verbose(F, "showing " + $dyemarkers.length + " dyemarkers of type " + this.vts(dyemarker_type));
  
  $dyemarkers.closest("TR").show();

} // end method


// -------------------------------------------------------------------------------
dtack__dyemarkers__buttons_c.prototype.hide = function(dyemarker_type)
{
  var F = "hide";
  
  var $dyemarkers = this.$dyemarkers.filter(".T_" + dyemarker_type);
  
  this.debug_verbose(F, "hiding " + $dyemarkers.length + " dyemarkers of type " + this.vts(dyemarker_type));
  
  $dyemarkers.closest("TR").hide();

} // end method


// -------------------------------------------------------------------------------
dtack__dyemarkers__buttons_c.prototype.send_update = function(dyemarker_type, value, options)
{
  var F = "send_update";
          
  this.debug_verbose(F, "ajaxing update " + dyemarker_type + " value to " + this.vts(value) +
    (this.option_value(options, "page_name")? " for " + this.option_value(options, "page_name"): ""));
    
  this.page_object.update_user_preference("dyemarker_"  + dyemarker_type, value, options);

} // end method
