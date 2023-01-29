
// --------------------------------------------------------------------
// class representing a geometric region

										// inherit the base methods and variables
dtack_drawing_region_c.prototype = new dtack_base2_c();
										/* remember who the base class is */
dtack_drawing_region_c.prototype.parent = dtack_base2_c;

// -------------------------------------------------------------------------------
// constructor

function dtack_drawing_region_c(dtack_environment, definition_object)
{
  var F = "dtack_drawing_region_c";
										// initilialize the base instance variables
  this.construct(dtack_environment, F);

  for(var attribute_name in definition_object)
  {
	this[attribute_name] = definition_object[attribute_name];
	//this.debug(F,  attribute_name + " is " + this[attribute_name]);
  }

} // end constructor

// -------------------------------------------------------------------------------
dtack_drawing_region_c.prototype.debug_dimensions = function(
  F)
{


  this.debug(F,
    "size " + this.xe + "x" + this.ye);

} // end method

