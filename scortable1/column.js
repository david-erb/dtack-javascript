// --------------------------------------------------------------------
// class which manages the interaction between a pair of text boxes which are supposed to confirm a particular input value

										// inherit the base methods and variables
dtack__scortable__column_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack__scortable__column_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
dtack__scortable__column_c.prototype.constructor = dtack__scortable__column_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__scortable__column_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__scortable__column_c";

										/* call the base class constructor helper */
	dtack__scortable__column_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  classname != undefined? classname: F);
                             
	this.push_class_hierarchy(F);

    this.CONSTANTS = {}
    this.CONSTANTS.EVENTS = {};
    this.CONSTANTS.EVENTS.SOMETHING = "dtack__scortable__column_c::SOMETHING";

  }
  
} // end constructor
                                                             

// -------------------------------------------------------------------------------

dtack__scortable__column_c.prototype.activate = function(
  $grid,
  $column,
  options)
{
  var F = "activate";
                                        // remember the defining things as instance variables
  this.$grid = $grid,
  this.$column = $column;
  
  this.column_identifier =
    this.$column.attr("data-scortable_column");

  this.grid_column_identifier =
    this.$grid.attr("data-scortable_grid") + ":" +
    this.column_identifier;
  
  var user_preference_values = dtack_environment.host_value("user_preferences.values", new Object());
  var user_preference_defaults = dtack_environment.host_value("user_preferences.defaults", new Object());
  
  var current_column = user_preference_values["scortable " + this.$grid.attr("data-scortable_grid")];
  if (current_column === undefined)
    current_column = user_preference_defaults["scortable " + this.$grid.attr("data-scortable_grid")];
                  
  var direction;
  if (current_column == this.column_identifier)
  {
    direction = user_preference_values["scortable " + this.grid_column_identifier];
    if (direction === undefined)
      direction = user_preference_defaults["scortable " + this.grid_column_identifier];
  
    if (!direction)
      direction = "ascending";
  }
  else
  {
  	direction = "unsorted";
  }
  
  this.$column.append("<div class=\"T_scortable_icon T_" + direction + "\"></div>");
    
  var that = this;
  
  this.$column.click(
    function()
    {
      global_page_object.post({
        command: "SCORTABLE_SORT",
        arguments: "scortable " + that.grid_column_identifier,
        should_post_crumb: "prior"
	  });
	}
  );

} // end method
