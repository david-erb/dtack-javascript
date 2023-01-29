// --------------------------------------------------------------------

										// inherit the base methods and variables
dtack__gmap__shape_c.prototype = new dtack__gmap__output_base_c();

                                        // provide an explicit name for the base class
dtack__gmap__shape_c.prototype.base = dtack__gmap__output_base_c.prototype;

										// override the constructor
dtack__gmap__shape_c.prototype.constructor = dtack__gmap__shape_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__gmap__shape_c(dtack_environment, name, definition, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__gmap__shape_c";

										/* call the base class constructor helper */
	dtack__gmap__shape_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  name,
	  definition,
	  classname != undefined? classname: F);
  }
  
} // end constructor


// -------------------------------------------------------------------------------

dtack__gmap__shape_c.prototype.activate = function(participants, options)
{
  var F = "activate";
                                        // let the base class activate
  dtack__gmap__shape_c.prototype.base.activate.call(this, participants, options);
  
  this.poly_options =
    {
      strokeColor: this.definition.color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: this.definition.color,
      fillOpacity: 0.35
    };
  	
  if (this.definition.type == "polygon")  
  {
  	this.poly_options.strokeWeight = 2;

	this.polything = new google.maps.Polygon(this.poly_options);
  }
  else
  {
  	this.poly_options.strokeWeight = 4;
	this.polything = new google.maps.Polyline(this.poly_options);
  }
                        
  this.polything.setMap(this.map);
  
  var latlng_array = new Array();



  var bounds = new google.maps.LatLngBounds();

  for (var index in this.definition.vertices)
  {                                                                                    
    var latlng = this.unserialize_latlng(this.definition.vertices[index].latlng);
    latlng_array[latlng_array.length] = latlng;
    bounds.extend(latlng);
  }
  
  this.debug(F, "latlng_array.length is: " + latlng_array.length);
  
  this.polything.setPath(latlng_array);

  this.center_latlng = bounds.getCenter();

  this.activate_info_window(options);
} // end method

// -------------------------------------------------------------------------------

dtack__gmap__shape_c.prototype.activate_info_window = function(options)
{
  var F = "activate_info_window";

                                        // there is info window content in the definition?
  if (this.definition.info_window_content !== undefined)
  {
    this.info_window = new google.maps.InfoWindow(
      {
        content: this.definition.info_window_content,
        
                                        // move the tip of the info window taper above where the mouse position
        pixelOffset: new google.maps.Size(0, -4)
	  });
  }
  
  var that = this;
	                                  // we have an info window object?
  if (this.info_window !== undefined)
  {
    if (this.definition.info_window_show == "always")
    {
      this.info_window.setPosition(this.center_latlng);
      this.info_window.open(this.map);
	}
	else
    if (this.definition.info_window_show == "hover")
    {
      google.maps.event.addListener(
        this.polything, 
        "mouseover", 
        function(event) 
        {
          if (that.definition.type == "polygon")  
          {
            that.info_window.setPosition(that.center_latlng); 
		  }
		  else
		  {
            that.info_window.setPosition(event.latLng); 
		  }
          that.info_window.open(that.map);
        }
      );
      google.maps.event.addListener(
        this.polything, 
        "mouseout", 
        function() {that.info_window.close();});
	}
  }
  
  if (this.definition.click_post_options !== undefined)
  {
    google.maps.event.addListener(
      this.marker, 
      "click", 
      function() {global_page_object.post(that.definition.click_post_options);});
  }

} // end method
// -------------------------------------------------------------------------------


dtack__gmap__shape_c.prototype.clicked = function(event)
{
  var F = "dtack__gmap__shape_c::clicked";
  
                                        // let the base class get the click
  dtack__gmap__shape_c.prototype.base.clicked.call(this, event);
  
} // end method
