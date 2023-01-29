// --------------------------------------------------------------------

										// inherit the base methods and variables
dtack__gmap__view_c.prototype = new dtack__gmap__base_c();

                                        // provide an explicit name for the base class
dtack__gmap__view_c.prototype.base = dtack__gmap__base_c.prototype;

										// override the constructor
dtack__gmap__view_c.prototype.constructor = dtack__gmap__view_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__gmap__view_c(dtack_environment, textarea_selector, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__gmap__view_c";

										/* call the base class constructor helper */
	dtack__gmap__view_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  textarea_selector,
	  classname != undefined? classname: F);
  }

  this.$textarea = null;
  this.definition = null;
  
} // end constructor


// -------------------------------------------------------------------------------

dtack__gmap__view_c.prototype.activate = function(participants, options)
{
  var F = "activate";
  
  var that = this;
                                        // let the base class activate
  dtack__gmap__view_c.prototype.base.activate.call(this, participants, options);

  if (typeof this.input_selector === "string")
  {
                                        // location the associated textarea
    this.$textarea = this.$require(this.input_selector);
  }
  else
  {
  	this.definition = this.input_selector; 
  }

  
  
  
  var parts;
  if (this.is_input_mode())
  {
    parts = this.$textarea.val().split(";");
  }
  else
  {
    parts = this.definition.view.split(";");
  }

  var lat = parseFloat(parts[0]);  
  var lng = parseFloat(parts[1]);  
  var zoom = parseFloat(parts[2]);  
  
  if (!isNaN(lat) && !isNaN(lng))
    this.participants.peek_map().setCenter({lat: lat, lng: lng});

  if (!isNaN(zoom))
    this.participants.peek_map().setZoom(zoom);

  if (typeof this.input_selector === "string")
  {
  
                                        // handle events on the shared map
    //google.maps.event.addListener(this.map, "center_changed", function(event) {that.auto_update(event);});
    google.maps.event.addListener(this.map, "dragend", function(event) {that.auto_update(event);});
    google.maps.event.addListener(this.map, "zoom_changed", function(event) {that.auto_update(event);});
  }
  
} // end method

// -------------------------------------------------------------------------------

dtack__gmap__view_c.prototype.is_input_mode = function()
{
  return this.definition === null; 

} // end method

// -------------------------------------------------------------------------------

dtack__gmap__view_c.prototype.clicked = function(event)
{
  var F = "dtack__gmap__view_c::clicked";
  
  if (!this.is_input_mode())
    return;
                                        // let the base class get the click
  dtack__gmap__view_c.prototype.base.clicked.call(this, event);
  
  this.debug(F, "handling view click for " + this.input_selector);

  var value = 
    event.latLng.lat() + ";" +
    event.latLng.lng() + ";" +
    this.participants.peek_map().getZoom();
    
  this.participants.peek_map().setCenter(event.latLng);
  
  this.update_textarea(value);
} // end method

// -------------------------------------------------------------------------------

dtack__gmap__view_c.prototype.auto_update = function(event)
{
  var F = "dtack__gmap__view_c::auto_update";

  var value = 
    this.serialize_latlng(this.participants.peek_map().getCenter()) + ";" +
    this.participants.peek_map().getZoom();
  
  this.update_textarea(value);
} // end method

// -------------------------------------------------------------------------------

dtack__gmap__view_c.prototype.update_textarea = function(value)
{
  this.$textarea.val(value);
  
  // this is what triggers the ajax
  this.$textarea.trigger("change");
  
} // end method


// -------------------------------------------------------------------------------

dtack__gmap__view_c.prototype.attach = function()
{
                                        // let the base class attach
  dtack__gmap__view_c.prototype.base.attach.call(this);
  
} // end method
// -------------------------------------------------------------------------------

dtack__gmap__view_c.prototype.detach = function()
{
                                        // let the base class detach
  dtack__gmap__view_c.prototype.base.detach.call(this);

  this.is_attached = false;
} // end method
