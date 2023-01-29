// --------------------------------------------------------------------

										// inherit the base methods and variables
dtack__gmap__display_base_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack__gmap__display_base_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
dtack__gmap__display_base_c.prototype.constructor = dtack__gmap__display_base_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__gmap__display_base_c(dtack_environment, name, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__gmap__display_base_c";

										/* call the base class constructor helper */
	dtack__gmap__display_base_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  classname != undefined? classname: F);

	this.push_class_hierarchy(F);
  }
  
  this.debug_identifier = name;
  this.name = name;

  this.participants = null;
  this.$definition = null;
  this.map = null;
  
} // end constructor


// -------------------------------------------------------------------------------


dtack__gmap__display_base_c.prototype.activate = function(participants, $definition, options)
{
  var F = "activate";
  
  var that = this;
  
                                        // remember the participants manager who is coordinating us
  this.participants = participants;

  this.$definition = $definition;
  
                                        // keep a reference to the map we are participating in
  this.map = this.participants.peek_map();
  
                                        // handle click on the entity
//  this.click_listener = google.maps.event.addListener(
//    this.map, "click", 
//    function(event) 
//    {
//      that.clicked(event);
//	}
//  );

} // end method


// -------------------------------------------------------------------------------


dtack__gmap__display_base_c.prototype.dispose = function()
{
  var F = "activate";
                                        // remove clicks on the entity
  google.maps.event.removeListener(
    this.click_listener);
                                        // forget the participants manager who is coordinating us
  this.participants = undefined;
                                        // forget the reference to the map we are participating in
  this.map = undefined;
                        
  this.$definition = undefined;

} // end method

// -------------------------------------------------------------------------------
dtack__gmap__display_base_c.prototype.show = function()
{
  var F = "dtack__gmap__base_c::show";
  
 // this.debug(F, "base show " + this.name);
  
} // end method

// -------------------------------------------------------------------------------
dtack__gmap__display_base_c.prototype.hide = function()
{
  var F = "dtack__gmap__base_c::hide";
  
  //this.debug(F, "base hide " + this.name);
  
} // end method

// -------------------------------------------------------------------------------
dtack__gmap__display_base_c.prototype.clicked = function(event)
{
  var F = "dtack__gmap__display_base_c::click";
  
  this.debug(F, "output base click handled for " + this.name);
  
} // end method
                  
