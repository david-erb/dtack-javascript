// --------------------------------------------------------------------

										// inherit the base methods and variables
dtack__gmap__marker_c.prototype = new dtack__gmap__output_base_c();

                                        // provide an explicit name for the base class
dtack__gmap__marker_c.prototype.base = dtack__gmap__output_base_c.prototype;

										// override the constructor
dtack__gmap__marker_c.prototype.constructor = dtack__gmap__marker_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__gmap__marker_c(dtack_environment, name, definition, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__gmap__marker_c";

										/* call the base class constructor helper */
	dtack__gmap__marker_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  name,
	  definition,
	  classname != undefined? classname: F);
  }
  
} // end constructor


// -------------------------------------------------------------------------------

dtack__gmap__marker_c.prototype.activate = function(participants, options)
{
  var F = "activate";
                                        // let the base class activate
  dtack__gmap__marker_c.prototype.base.activate.call(this, participants, options);

                                        // get the actual geo position of the marker
  var latlng = this.unserialize_latlng(this.definition.latlng);
    
  if (latlng !== null)
  {
  	                                    // make a new marker on the map
    this.marker = new google.maps.Marker();
    this.marker.setPosition(latlng);
    this.marker.setMap(this.map);
                                        // put the icon on the marker
    var icon = this.definition.icon;
    if (icon !== undefined &&
        icon !== "")
    {
      if (icon.substr(0, 5) != "http:")
        icon = this.host_require("dtack_gmap.icons_url_path") + "/" + icon + ".png";
      this.debug(F, "setting marker icon \"" + icon + "\"");
      this.marker.setIcon(icon);
    }
    else
    {
      this.debug(F, "no special icon");
	}
    
    if (this.definition.info_window_content !== undefined)
    {
      this.info_window = new google.maps.InfoWindow(
        {
          content: this.definition.info_window_content
		});
	}
	
	var that = this;
	
    if (this.info_window !== undefined)
    {
      if (this.definition.info_window_show == "always")
      {
        this.info_window.open(this.map, this.marker);
	  }
	  else
      if (this.definition.info_window_show == "hover")
      {
        google.maps.event.addListener(
          this.marker, 
          "mouseover", 
          function() {that.info_window.open(that.map, that.marker);});
        google.maps.event.addListener(
          this.marker, 
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
	
  }

} // end method

// -------------------------------------------------------------------------------


dtack__gmap__marker_c.prototype.clicked = function(event)
{
  var F = "dtack__gmap__marker_c::clicked";
  
                                        // let the base class get the click
  dtack__gmap__marker_c.prototype.base.clicked.call(this, event);
  
} // end method
