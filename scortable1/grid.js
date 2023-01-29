// --------------------------------------------------------------------
// class which manages the interaction between a pair of text boxes which are supposed to confirm a particular input value

										// inherit the base methods and variables
dtack__scortable__grid_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack__scortable__grid_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
dtack__scortable__grid_c.prototype.constructor = dtack__scortable__grid_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__scortable__grid_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__scortable__grid_c";

										/* call the base class constructor helper */
	dtack__scortable__grid_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  classname != undefined? classname: F);
                             
	this.push_class_hierarchy(F);

    this.CONSTANTS = {}
    this.CONSTANTS.EVENTS = {};
    this.CONSTANTS.EVENTS.SOMETHING = "dtack__scortable__grid_c::SOMETHING";

  }
  
} // end constructor
                                                             

// -------------------------------------------------------------------------------


dtack__scortable__grid_c.prototype.activate = function(
  page,
  $grid,
  options)
{
  var F = "activate";
                                        // remember the defining things as instance variables
  this.page = page;
  this.$grid = $grid;
  this.$columns = $(".dtack_javascript__scortable_column", this.$grid);
  
  this.column_objects = new Array();
                   
  var that = this;

  this.$columns.each(
    function() 
    {
      var column = new dtack__scortable__column_c(that.dtack_environment);
      column.activate($grid, $(this), options);
      that.column_objects.push(column);
    }
  );
} // end method
