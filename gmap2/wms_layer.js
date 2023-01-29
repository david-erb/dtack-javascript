// --------------------------------------------------------------------

										// inherit the base methods and variables
dtack__gmap__wms_layer_c.prototype = new dtack__gmap__output_base_c();

                                        // provide an explicit name for the base class
dtack__gmap__wms_layer_c.prototype.base = dtack__gmap__output_base_c.prototype;

										// override the constructor
dtack__gmap__wms_layer_c.prototype.constructor = dtack__gmap__wms_layer_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__gmap__wms_layer_c(dtack_environment, name, definition, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__gmap__wms_layer_c";

										/* call the base class constructor helper */
	dtack__gmap__wms_layer_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  name,
	  definition,
	  classname != undefined? classname: F);
  }
  
} // end constructor

                                                             
// -------------------------------------------------------------------------------

dtack__gmap__wms_layer_c.prototype.activate = function(participants, options)
{
  var F = "activate";
                                        // let the base class activate
  dtack__gmap__wms_layer_c.prototype.base.activate.call(this, participants, options);
  
  var that = this;

  this.assert("this.definition is undefined", this.definition !== undefined);
  this.assert("this.definition.wms_url is undefined", this.definition.wms_url !== undefined);
  
  var maptype = new google.maps.ImageMapType(
    {
      alt: "OpenLayers",
      getTileUrl: function(tile, zoom) {return that.peek_tile_url(tile, zoom);},
      isPng: false,
      maxZoom: 17,
      minZoom: 1,
      name: "OpenLayers",
      tileSize: new google.maps.Size(256, 256)
    }
  );
       
//  this.map.mapTypes.set('moon', maptype);
//  this.map.setMapTypeId('moon');
    
    this.map.overlayMapTypes.push(maptype);
    
  return;
                                        // initially hide the layer?
	if (this.definition.should_hide)
	{
      this.debug(F, "activating but hiding wms_layer url " + url);
      this.hide();
	}
                                        // initially show the layer?
	else
	{
      this.debug(F, "activating and showing wms_layer url " + url);
      this.show();
	}
    
    google.maps.event.addListener(
        this.wms_layer, 
        "status_changed", 
        function() {that.status_changed();});

} // end method

// -------------------------------------------------------------------------------


dtack__gmap__wms_layer_c.prototype.peek_tile_url = function(tile, zoom)
{
  var F = "dtack__gmap__wms_layer_c::peek_tile_url";
  
//  return "http://gis.drcog.org/geoserver/DRCOGPUB/wms" +
//    "?service=WMS" +
//    "&version=1.1.0" +
//    "&request=GetMap" +
//    "&layers=DRCOGPUB%3Arapid_transit_system_2035" +
//    "&styles=" +
//    "&bbox=3069879.5%2C1616060.25%2C3231971.0%2C1885244.625" +
//    "&width=308" +
//    "&height=512" +
//    "&srs=EPSG%3A2232" +
//    "&transparent=yes" +
//    "&format=image/png";
                                        // get the actual web location of the wms_layer
  //var url = this.definition.url;

  var projection = this.map.getProjection();
  var zpow = Math.pow(2, zoom);
  var ul = new google.maps.Point(tile.x * 256.0 / zpow, (tile.y + 1) * 256.0 / zpow);
  var lr = new google.maps.Point((tile.x + 1) * 256.0 / zpow, (tile.y) * 256.0 / zpow);
  var ulw = projection.fromPointToLatLng(ul);
  var lrw = projection.fromPointToLatLng(lr);
  
  var bbox;
  if (this.definition.wms_version &&
      this.definition.wms_version == "1.1.0")
  {
    bbox = ulw.lng() + "," + ulw.lat() + "," + lrw.lng() + "," + lrw.lat();
  }
  else
  {
    //With the 1.3.0 version the coordinates are read in LatLon, as opposed to LonLat in previous versions
    bbox = ulw.lat() + "," + ulw.lng() + "," + lrw.lat() + "," + lrw.lng();
  }

  //Establish the baseURL.  Several elements, including &EXCEPTIONS=INIMAGE and &Service are unique to openLayers addresses.
  var url = this.definition.wms_url + 
    "?Layers=" + this.definition.wms_layers + 
    "&version=" + this.definition.wms_version + 
    //"&EXCEPTIONS=INIMAGE" + 
    "&Service=WMS" +
    "&request=GetMap" + 
    "&format=" + this.definition.wms_format + 
    (this.definition.wms_styles? "&Styles=" + this.definition.wms_styles: "") + 
    (this.definition.wms_srs? "&SRS=" + this.definition.wms_srs: "") + 
    (this.definition.wms_crs? "&CRS=" + this.definition.wms_crs: "") + 
    "&BBOX=" + bbox + 
    "&width=" + this.definition.wms_width + 
    "&height=" + this.definition.wms_height;
  
  this.debug(F, "tile url is " + url);
  
  return url;

} // end method

// -------------------------------------------------------------------------------


dtack__gmap__wms_layer_c.prototype.status_changed = function(event)
{
  var F = "dtack__gmap__wms_layer_c::status_changed";
  
                                        // let the base class get the click
  this.debug(F, "wms_layer status changed to: " + this.wms_layer.getStatus() + " for url " + this.definition.url);
  
} // end method

// -------------------------------------------------------------------------------
dtack__gmap__wms_layer_c.prototype.show = function()
{
  var F = "dtack__gmap__wms_layer_c::show";
                                          // let the base class show
  dtack__gmap__wms_layer_c.prototype.base.show.call(this);

  this.debug(F, "wms_layer show " + this.name);
  
  //this.wms_layer.setMap(this.map);

} // end method


// -------------------------------------------------------------------------------
dtack__gmap__wms_layer_c.prototype.hide = function()
{
  var F = "dtack__gmap__wms_layer_c::hide";
                                          // let the base class hide
  dtack__gmap__wms_layer_c.prototype.base.hide.call(this);
  
  this.debug(F, "wms_layer hide " + this.name);
  
  //this.wms_layer.setMap(null);

} // end method
