// --------------------------------------------------------------------

										// inherit the base methods and variables
dtack__gmap__output_base_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack__gmap__output_base_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
dtack__gmap__output_base_c.prototype.constructor = dtack__gmap__output_base_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__gmap__output_base_c(dtack_environment, name, definition, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__gmap__output_base_c";

										/* call the base class constructor helper */
	dtack__gmap__output_base_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  classname != undefined? classname: F);
  }
  
  this.debug_identifier = name;
  this.name = name;
  this.definition = definition;

  this.participants = null;
  
  this.map = null;
  
  this.gis_style = null;

  this.google_shape_object = null;
    
} // end constructor


// -------------------------------------------------------------------------------


dtack__gmap__output_base_c.prototype.activate = function(participants, options)
{
  var F = "activate";
                   
  this.assert("participants is " + this.vts(participants), participants);
  this.assert("participants.peek_map() is " + this.vts(participants.peek_map()), participants.peek_map());

  var that = this;
                                        // remember the participants manager who is coordinating us
  this.participants = participants;
  
                                        // keep a reference to the map we are participating in
  this.map = this.participants.peek_map();
  
                                        // handle click on the entity
//  google.maps.event.addListener(
//    this.map, "click", 
//    function(event) 
//    {
//      that.clicked(event);
//	}
//  );

} // end method


// -------------------------------------------------------------------------------
dtack__gmap__output_base_c.prototype.poke_gis_style = function(gis_style)
{
  var F = "dtack__gmap__base_c::poke_gis_style";
  
  this.gis_style = gis_style;

} // end method


// -------------------------------------------------------------------------------
dtack__gmap__output_base_c.prototype.poke_google_shape_object = function(google_shape_object)
{
  var F = "dtack__gmap__base_c::poke_google_shape_object";
  
  this.google_shape_object = google_shape_object;

} // end method



// -------------------------------------------------------------------------------
dtack__gmap__output_base_c.prototype.peek_google_shape_object = function()
{
  var F = "dtack__gmap__base_c::peek_google_shape_object";
  
  return this.google_shape_object;

} // end method

// -------------------------------------------------------------------------------
dtack__gmap__output_base_c.prototype.show = function()
{
  var F = "dtack__gmap__base_c::show";
  
  //this.debug(F, "base show " + this.name);
  
} // end method


// -------------------------------------------------------------------------------
dtack__gmap__output_base_c.prototype.hide = function()
{
  var F = "dtack__gmap__base_c::hide";
  
  //this.debug(F, "base hide " + this.name);
  
} // end method

// -------------------------------------------------------------------------------
dtack__gmap__output_base_c.prototype.clicked = function(event)
{
  var F = "dtack__gmap__output_base_c::click";
  
  this.debug(F, "output base click handled for " + this.name);
  
} // end method
