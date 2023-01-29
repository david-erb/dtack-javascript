// --------------------------------------------------------------------

										// inherit the base methods and variables
dtack__gmap__kml_c.prototype = new dtack__gmap__output_base_c();

                                        // provide an explicit name for the base class
dtack__gmap__kml_c.prototype.base = dtack__gmap__output_base_c.prototype;

										// override the constructor
dtack__gmap__kml_c.prototype.constructor = dtack__gmap__kml_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__gmap__kml_c(dtack_environment, name, definition, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__gmap__kml_c";

										/* call the base class constructor helper */
	dtack__gmap__kml_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  name,
	  definition,
	  classname != undefined? classname: F);
  }
  
} // end constructor


// -------------------------------------------------------------------------------

dtack__gmap__kml_c.prototype.activate = function(participants, options)
{
  var F = "activate";
                                        // let the base class activate
  dtack__gmap__kml_c.prototype.base.activate.call(this, participants, options);

                                        // get the actual web location of the kml
  var url = this.definition.url;

    
  if (url !== null)
  {
  	                                    // make a new kml on the map
    this.kml = new google.maps.KmlLayer(
      {
      	"url": url,
      	"preserveViewport": true

	  }
	);
                                        // initially hide the layer?
	if (this.definition.should_hide)
	{
      this.debug(F, "activating but hiding kml url " + url);
      this.hide();
	}
                                        // initially show the layer?
	else
	{
      this.debug(F, "activating and showing kml url " + url);
      this.show();
	}

    var that = this;
    
    google.maps.event.addListener(
        this.kml, 
        "status_changed", 
        function() {that.status_changed();});
  }

} // end method

// -------------------------------------------------------------------------------


dtack__gmap__kml_c.prototype.status_changed = function(event)
{
  var F = "dtack__gmap__kml_c::status_changed";
  
                                        // let the base class get the click
  this.debug(F, "kml status changed to: " + this.kml.getStatus() + " for url " + this.definition.url);
  
} // end method

// -------------------------------------------------------------------------------
dtack__gmap__kml_c.prototype.show = function()
{
  var F = "dtack__gmap__kml_c::show";
                                          // let the base class show
  dtack__gmap__kml_c.prototype.base.show.call(this);

  this.debug(F, "kml show " + this.name);
  
  this.kml.setMap(this.map);

} // end method


// -------------------------------------------------------------------------------
dtack__gmap__kml_c.prototype.hide = function()
{
  var F = "dtack__gmap__kml_c::hide";
                                          // let the base class hide
  dtack__gmap__kml_c.prototype.base.hide.call(this);
  
  this.debug(F, "kml hide " + this.name);
  
  this.kml.setMap(null);

} // end method
