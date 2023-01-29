// --------------------------------------------------------------------

										// inherit the base methods and variables
dtack__gmap__participants_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack__gmap__participants_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
dtack__gmap__participants_c.prototype.constructor = dtack__gmap__participants_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__gmap__participants_c(page, map_selector, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__gmap__participants_c";

										/* call the base class constructor helper */
	dtack__gmap__participants_c.prototype.base.constructor.call(
	  this,
	  page.dtack_environment,
	  classname != undefined? classname: F);
    
    this.push_class_hierarchy(F);

    this.CONSTANTS = {}
    this.CONSTANTS.EVENTS = {};
    this.CONSTANTS.EVENTS.MAP_VIEW_CHANGED = "map_view_changed";
  }
  
  this.page = page;
  
  this.map_selector = map_selector;
  
  this.map = null;
  
  this.participants = new Array();
   
  this.participant_count = 0;
  
  
} // end constructor


// -------------------------------------------------------------------------------

dtack__gmap__participants_c.prototype.peek_map = function()
{
  return this.map;

} // end method

// -------------------------------------------------------------------------------

dtack__gmap__participants_c.prototype.compose_bounding_box_xml = function()
{

  var map_bounds = this.map.getBounds();
  
  if (!map_bounds)
    return null;
  
  var zoom = this.cluster_zoom;
  
  if (zoom === undefined)
    zoom = this.map.getZoom();
    
  var bounding_box_xml =
    "<api>" + "google_maps" + "</api>" +
    "<projection>wgs84</projection>" +
    "<zoom>" + zoom + "</zoom>" +
    "<map_zoom>" + this.map.getZoom() + "</map_zoom>" +
    "<cluster_zoom>" + this.cluster_zoom + "</cluster_zoom>" +
    "<div_width>" + $(this.map.getDiv()).width() + "</div_width>" +
    "<div_height>" + $(this.map.getDiv()).height() + "</div_height>" +
    "<center>" + this.map.getCenter().lng().toString() + "," + this.map.getCenter().lat().toString() + "</center>" +
    "<bounding_box>" +
    "<ul>" + map_bounds.getSouthWest().lng().toString() + "," + map_bounds.getNorthEast().lat().toString() + "</ul>" +
    "<lr>" + map_bounds.getNorthEast().lng().toString() + "," + map_bounds.getSouthWest().lat().toString() + "</lr>" +
    "</bounding_box>";
    
  return bounding_box_xml;
  
} // end method

// -------------------------------------------------------------------------------

dtack__gmap__participants_c.prototype.poke_cluster_zoom = function(cluster_zoom)
{
  var F = "poke_cluster_zoom";
                           
  this.cluster_zoom = cluster_zoom;

} // end method

// -------------------------------------------------------------------------------

dtack__gmap__participants_c.prototype.peek_cluster_zoom = function()
{
  var F = "poke_cluster_zoom";
                           
  if (this.cluster_zoom !== undefined)
    return this.cluster_zoom;
    
  return this.map.getZoom();

} // end method

// -------------------------------------------------------------------------------

dtack__gmap__participants_c.prototype.add = function(participant)
{
  var F = "add";
                           
  this.add_participant_by_index(participant, this.participant_count++)

} // end method

// -------------------------------------------------------------------------------

dtack__gmap__participants_c.prototype.add_participant_by_index = function(participant, index)
{
  var F = "add_participant_by_index";
  
  this.participants[index] = participant;

} // end method

// -------------------------------------------------------------------------------
dtack__gmap__participants_c.prototype.default_integer_option = function(options, variable_name, default_value)
{
  var value = parseInt(this.option_value(options, variable_name, null));
  
  if (isNaN(value))
    value = parseInt(this.resolve_symbol("dtack__gmap.default_map." + variable_name, null));
    
  if (isNaN(value))
    value = default_value;
    
  return value;
  
} // end method

// -------------------------------------------------------------------------------
dtack__gmap__participants_c.prototype.default_float_option = function(options, variable_name, default_value)
{
  var value = parseFloat(this.option_value(options, variable_name, null));
  
  if (isNaN(value))
    value = parseFloat(this.resolve_symbol("dtack__gmap.default_map." + variable_name, null));
    
  if (isNaN(value))
    value = default_value;
    
  return value;
  
} // end method

// -------------------------------------------------------------------------------


dtack__gmap__participants_c.prototype.activate = function(options)
{
  var F = "activate";
  
  this.debug_verbose(F, "options is " + this.vts(options));
                                                              
  var zoom = this.default_integer_option(options, "zoom", 12);
  var center = {};
  center.lng = this.default_float_option(options, "lng", -104.8539911002045800);
  center.lat = this.default_float_option(options, "lat", 39.7220624441362420);
                                                                                 
  var mapOptions = 
  {
  // should get from global_map_data.json.settings.map.view
    //center: { lat: 39.70850737329455, lng: -104.82776641845703},
    //center: { lat: 39.6013857450447940, lng: -104.8460699997959300},
    //center: { lat: 39.60459972957337, lng: -104.71061042333929},
    //zoom: 14
    //zoom: 14, center: { lng: -104.7058591182936600, lat: 39.6013857450447940}, // E Smokey Hill Rd
    //zoom: 8, center: { lng: -104.6741203131529000, lat: 39.6132102634435980}, // feature autoid 19650
    //zoom: 12, center: {lng: -104.8539911002045800, lat: 39.7220624441362420}      // first MDB file pipe appurtenance      
    zoom: zoom,
    center: center
  };
  
  this.map = new google.maps.Map(
    $(this.map_selector).get(0),
    mapOptions);
                                                                                                                                    
  var that = this;
  
  google.maps.event.addListener(this.map, "idle", function() {that.pull_triggers(that.CONSTANTS.EVENTS.MAP_VIEW_CHANGED, that);});
  //google.maps.event.addListener(this.map, "zoom_changed", function() {that.pull_triggers("map_view_changed", that);});
  
  for(var k in this.participants)
  {
  	this.participants[k].activate(this);
  }  

} // end method

// -------------------------------------------------------------------------------


dtack__gmap__participants_c.prototype.reactivate = function()
{
  var F = "reactivate";
  
  google.maps.event.trigger(this.map, "resize");  
  
  for(var k in this.participants)
  {
  	this.participants[k].activate(this);
  }  

} // end method
// -------------------------------------------------------------------------------


dtack__gmap__participants_c.prototype.attach_participant_by_index = function(participant_index)
{
  var F = "attach_participant_by_index";
  
  if (this.participants[participant_index] !== undefined)
  {
    this.participants[participant_index].attach();
  }
} // end method

// -------------------------------------------------------------------------------


dtack__gmap__participants_c.prototype.detach = function(participant)
{
  var F = "detach";
                         
  for(var k in this.participants)
  {
  	this.participants[k].detach();
  }  

} // end method

// -------------------------------------------------------------------------------
dtack__gmap__participants_c.prototype.show_participant_by_index = function(index)
{
  var F = "dtack__gmap__participants_c::show_participant_by_index";
  
  var participant = this.search(index);
  
  if (participant)
  {
    //this.debug(F, "showing participant with index \"" + index + "\"");
    
    participant.show();
  }
  
} // end method

// -------------------------------------------------------------------------------
dtack__gmap__participants_c.prototype.hide_participant_by_index = function(index)
{
  var F = "dtack__gmap__participants_c::hide_participant_by_index";
  
  var participant = this.search(index);
  
  if (participant)
  {
    //this.debug(F, "hiding participant with index \"" + index + "\"");
    
    participant.hide();
  }
  
} // end method


// -------------------------------------------------------------------------------
dtack__gmap__participants_c.prototype.search = function(index)
{
  var F = "dtack__gmap__participants_c::search";
  
  var participant = this.participants[index];

  if (!participant)
  {
  	this.debug(F, "cannot find participant with index \"" + index + "\"");
  }
    
  return participant;
  
} // end method

// -------------------------------------------------------------------------------


dtack__gmap__participants_c.prototype.save = function(options)
{
  var F = "save";
                         
  for(var k in this.participants)
  {
  	this.participants[k].save(options);
  }  

} // end method

