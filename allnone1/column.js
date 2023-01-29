// --------------------------------------------------------------------
// class which manages the interaction between a pair of text boxes which are supposed to confirm a particular input value

										// inherit the base methods and variables
dtack__allnone__column_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack__allnone__column_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
dtack__allnone__column_c.prototype.constructor = dtack__allnone__column_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__allnone__column_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__allnone__column_c";

										/* call the base class constructor helper */
	dtack__allnone__column_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  classname != undefined? classname: F);
                             
	this.push_class_hierarchy(F);

    this.CONSTANTS = {}
    this.CONSTANTS.EVENTS = {};
    this.CONSTANTS.EVENTS.SOMETHING = "dtack__allnone__column_c::SOMETHING";

  }
  
} // end constructor
                                                             

// -------------------------------------------------------------------------------

dtack__allnone__column_c.prototype.activate = function(
  $grid,
  $column,
  options)
{
  var F = "activate";
                                        // remember the defining things as instance variables
  this.$grid = $grid,
  this.$column = $column;
  
  this.column_identifier =
    this.$column.attr("data-allnone_column");
  
  this.$column.append("<div class=\"T_allnone_icon T_all\"></div>");
  this.$column.append("<div class=\"T_allnone_icon T_none\"></div>");
    
  var that = this;
  
  $(".T_all", this.$column).click(
    function()
    {
      that.set(true);
	}
  );
  
  $(".T_none", this.$column).click(
    function()
    {
      that.set(false);
	}
  );

} // end method

// -------------------------------------------------------------------------------

dtack__allnone__column_c.prototype.set = function(
  flag)
{
  var F = "set";
  
  var $cells = $("[data-allnone_column='" + this.column_identifier + "']");
  
  var $checkboxes = $("INPUT[type='checkbox']", $cells);
  
  this.debug(F, "setting " + $cells.length + " cells" +
    " containing " + $checkboxes.length + " checkboxes" +
    " to " + flag);
  
  $checkboxes.each(
    function()
    {
                                        // checkbox state is being changed?
      if (flag != $(this).prop("checked"))
      {
      	                                // set the state
      	$(this).prop("checked", flag);
      	                                // trigger the change event on the checkbox
      	                                // eztask #15221 SATWAP: Satisfied BMP should not allow change in TAID on the BMP List. 
      	$(this).change();
	  }
	}
  );

} // end method
