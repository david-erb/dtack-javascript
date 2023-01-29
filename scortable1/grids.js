// --------------------------------------------------------------------
// class which manages the interaction between a pair of text boxes which are supposed to confirm a particular input value

										// inherit the base methods and variables
dtack__scortable__grids_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack__scortable__grids_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
dtack__scortable__grids_c.prototype.constructor = dtack__scortable__grids_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__scortable__grids_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__scortable__grids_c";

										/* call the base class constructor helper */
	dtack__scortable__grids_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  classname != undefined? classname: F);
                             
	this.push_class_hierarchy(F);

    this.CONSTANTS = {}
    this.CONSTANTS.EVENTS = {};
    this.CONSTANTS.EVENTS.SOMETHING = "dtack__scortable__grids_c::SOMETHING";

  }
  
} // end constructor
                                                             
                                                     
// -------------------------------------------------------------------------------


dtack__scortable__grids_c.prototype.activate = function(
  page,
  options)
{
  var F = "activate";
                                        // remember the defining things as instance variables
  this.page = page;
  this.$grids = $(".dtack_javascript__scortable_grid")
  
  this.grid_objects = new Array();
  
  var that = this;
  
  this.$grids.each(
    function() 
    {
      var grid = new dtack__scortable__grid_c(that.dtack_environment);
      grid.activate(page, $(this), options);
      that.grid_objects.push(grid);
    }
  );
} // end method
