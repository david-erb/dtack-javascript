// --------------------------------------------------------------------

										// inherit the base methods and variables
dtack__gmap__rectangle_c.prototype = new dtack__gmap__output_base_c();

                                        // provide an explicit name for the base class
dtack__gmap__rectangle_c.prototype.base = dtack__gmap__output_base_c.prototype;

										// override the constructor
dtack__gmap__rectangle_c.prototype.constructor = dtack__gmap__rectangle_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__gmap__rectangle_c(dtack_environment, name, definition, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__gmap__rectangle_c";

										/* call the base class constructor helper */
	dtack__gmap__rectangle_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  name,
	  definition,
	  classname != undefined? classname: F);
  }
  
} // end constructor


// -------------------------------------------------------------------------------

dtack__gmap__rectangle_c.prototype.activate = function(participants, options)
{
  var F = "activate";
                                        // let the base class activate
  dtack__gmap__rectangle_c.prototype.base.activate.call(this, participants, options);

  var bounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(this.definition.y0, this.definition.x0),
    new google.maps.LatLng(this.definition.y1, this.definition.x1));
  
  	                                    // make a new rectangle on the map
  var rectangle = new google.maps.Rectangle(
    {
      map: this.participants.peek_map(), 
      bounds: bounds
    }
  );
                                  
                                  
  if (this.gis_style)
  {
    rectangle.setOptions(this.gis_style.peek_rectangle_options());
  }

  
  if (this.definition.click_post_options !== undefined)
  {
    google.maps.event.addListener(
      this.rectangle, 
      "click", 
      function() {global_page_object.post(that.definition.click_post_options);});
  }

  this.poke_google_shape_object(rectangle);
  
} // end method

// -------------------------------------------------------------------------------


dtack__gmap__rectangle_c.prototype.clicked = function(event)
{
  var F = "dtack__gmap__rectangle_c::clicked";
  
                                        // let the base class get the click
  dtack__gmap__rectangle_c.prototype.base.clicked.call(this, event);
  
} // end method
