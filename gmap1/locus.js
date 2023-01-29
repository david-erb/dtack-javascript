// --------------------------------------------------------------------

										// inherit the base methods and variables
dtack__gmap__locus_c.prototype = new dtack__gmap__display_base_c();

                                        // provide an explicit name for the base class
dtack__gmap__locus_c.prototype.base = dtack__gmap__display_base_c.prototype;

										// override the constructor
dtack__gmap__locus_c.prototype.constructor = dtack__gmap__locus_c;

dtack__gmap__locus_CONSTANTS = {}
dtack__gmap__locus_CONSTANTS.EVENTS = {};
dtack__gmap__locus_CONSTANTS.EVENTS.CLICKED_MAP_PRIMITIVE = "CLICKED_MAP_PRIMITIVE";
dtack__gmap__locus_CONSTANTS.EVENTS.RECEIVED_FEATURES = "RECEIVED_FEATURES";

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__gmap__locus_c(dtack_environment, name, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__gmap__locus_c";

										/* call the base class constructor helper */
	dtack__gmap__locus_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  name,
	  classname != undefined? classname: F);

	this.push_class_hierarchy(F);

	this.map_primitives = new Array();
  }
  
} // end constructor


// -------------------------------------------------------------------------------

dtack__gmap__locus_c.prototype.activate = function(participants, $definition, options)
{
  var F = "activate";
                                        // let the base class activate
  dtack__gmap__locus_c.prototype.base.activate.call(this, participants, $definition, options);
  
  this.gis_style = new dtack__gmap__style_c(this.dtack_environment);
  
  var $gis_style_packet = $definition.children("gis_style");
  
  this.is_clustered =  $definition.attr("is_clustered") === "yes";
  
  this.gis_style.initialize_from_xml($gis_style_packet, this.is_clustered)
  
  var that = this;
                              
  this.$definition.children("path").each(function() {that.plot_path($(this))});

  //this.activate_info_window(options);
} // end method

// -------------------------------------------------------------------------------

dtack__gmap__locus_c.prototype.definition_attribute = function(name, default_value)
{
  var F = "definition_attribute";
  
  var value = this.$definition.attr(name);

  var is_default = false;  
  if (value === undefined)
  {
    value = default_value;
    is_default = true;
  }
    
  //this.debug(F, "definition attribute \"" + name + "\" is \"" + value + "\"" + (is_default? " (default)": ""));
  
  return value;
} // end method

// -------------------------------------------------------------------------------

dtack__gmap__locus_c.prototype.poke_filter = function(filter_name, filter_options)
{
  var F = "poke_filter";
  
  this.filter_name = filter_name;
  
  this.filter_options = filter_options;

} // end method

// -------------------------------------------------------------------------------

dtack__gmap__locus_c.prototype.peek_filter_xml = function()
{
  var F = "peek_filter_xml";

  var filter_xml = "";  
  
  if (this.filter_name)
  {
  	filter_xml += "<filter name=\"" + this.filter_name + "\">";
  	for(var k in this.filter_options)
  	{
  	  filter_xml += "<" + k + ">" + this.escape_xml(this.filter_options[k]) + "</" + k + ">";
	}
  	filter_xml += "</filter>";
  }

  return filter_xml;
  
} // end method

// -------------------------------------------------------------------------------

dtack__gmap__locus_c.prototype.dispose = function()
{
  var F = "activate";
  
  this.map_options = undefined;
  this.center_latlng = undefined;

  if (this.map_primitives)
  {
    for(var k in this.map_primitives)
    {
  	  var map_primitive = this.map_primitives[k];
  	  this.map_primitives[k] = undefined;
  	  
  	  if (typeof map_primitive.getPath === "function")
  	    map_primitive.getPath().clear();
  	    
  	  map_primitive.setMap(null);
    }
                                
  this.map_primitives.length = 0;
  this.map_primitives = undefined;
  }
                                        // let the base class dispose
  dtack__gmap__locus_c.prototype.base.dispose.call(this);

  //this.activate_info_window(options);
} // end method

                                             
// -------------------------------------------------------------------------------

dtack__gmap__locus_c.prototype.plot_path = function($path)
{
  var F = "plot_path";
  
                                        // get the reference position
  var path_x = parseFloat($path.attr("x"));
  var path_y = parseFloat($path.attr("y"));
  var path_a = $path.attr("a");
  if (!path_a)
    path_a = parseFloat($path.attr("f"));
  var path_t = $path.attr("t");

  //this.debug(F, "path_x reference \"" + $path.attr("x") + "\" which is float " + path_x);
  //this.debug(F, "path_y reference \"" + $path.attr("y") + "\" which is float " + path_y);
  
                                        // array of latlng we will build to make the path
  var latlng_array = new google.maps.MVCArray();
  
  var that = this;
  var last_x = undefined;
  var last_y = undefined;
                                        // try to make a style from the feature attributes indicated by the path's feature_autoguid
  var gis_style = this.make_gis_style($path);
  
                                        // could not get a path-specific style?
  if (!gis_style)
  {
  	                                    // use the locus's own style
  	                                    // all the features will be drawn with this style
  	                                    // should be ok for dimming since presumably the features are either all vector or all point
    gis_style = this.gis_style;
  }

  var google_shape_object;
  
  var $points = $path.children("p");
  if ($points.length === 0)
  {
	if (path_t == DTACK__GMAP__GIS_FEATURE_TYPE__TEXT)
    {
      var label = $path.attr("label");
      if (!label)
        label = "?";
      
  	                                    // make a new custom text overlay on the map
                                        // these map primitives are TxtOverlay things based on google.maps.OverlayView()
                                        // and don't currently act like other primitives such as Rectangle and Marker
      google_shape_object = new TxtOverlay(
        new google.maps.LatLng(path_y, path_x), 
        label, 
        $path.attr("css_class"),
        this.map, 
        {
      	  hover_text: $path.attr("hover"),
          extra: $path.attr("extra"),
                                        // eztask #13985: Project marker should be placed at the center of the project region
          label_dx: $path.attr("label_dx"),
          label_dy: $path.attr("label_dy")
		}
   	  );
   	  
   	                                    // for an example of a listener to clicks on these, see
   	                                    // sdmp100__common__javascript__overall_map_c.prototype.handle_clicked_map_primitive()
   	  google_shape_object.definition_options.jquery_click_function =
      	  function(event) 
          {
            var text_overlay = event.data;
            that.debug(F + "-click", "text overlay click with pos " + that.vts(text_overlay.pos));
            event.latLng = text_overlay.pos;
            that.handle_map_primitive_clicked(event, text_overlay);
		  };
	}
	else
	if (path_t == DTACK__GMAP__GIS_FEATURE_TYPE__RECTANGLE)
    {
      google_shape_object = new google.maps.Rectangle({map: this.map});
      gis_style.set_rectangle_options(google_shape_object);
      var path_x1 = parseFloat($path.attr("x1"));
      var path_y1 = parseFloat($path.attr("y1"));
      google_shape_object.setBounds(
        new google.maps.LatLngBounds(
          new google.maps.LatLng(path_y, path_x),
          new google.maps.LatLng(path_y1, path_x1)));
	}
	else
	if (path_t == DTACK__GMAP__GIS_FEATURE_TYPE__CIRCLE)
    {                                                        
      var x = parseFloat($path.attr("x"));
      var y = parseFloat($path.attr("y"));
      var radius = parseFloat($path.attr("r"));
      google_shape_object = new google.maps.Circle({map: this.map});
      gis_style.set_circle_options(google_shape_object);
      google_shape_object.setCenter(
          new google.maps.LatLng(y, x));
      google_shape_object.setRadius(radius);
//      this.debug(F, "drew circle with radius " + radius + " at " + x + ", " + y);
	}
	else
	{
  	                                    // make a new marker on the map
      google_shape_object = new google.maps.Marker({map: this.map});
      google_shape_object.setPosition(new google.maps.LatLng(path_y, path_x));
      gis_style.set_marker_options(google_shape_object);
	}
  }
  else
  {
                                        // loop over all the <p> (point) tags
    $points.each(
      function()
      {
         var x = parseFloat($(this).children("x").text()) + path_x;
         var y = parseFloat($(this).children("y").text()) + path_y;
         var latlng = new google.maps.LatLng(y, x);
         //that.debug(F, "plotting " + latlng.toString() +  (last_x === undefined? "": " distance " + (x - last_x)));
         //last_x = x;
         //last_y = y;
         
                                        // put vertex into the path
         latlng_array.push(latlng);
	  }
    );
                                        // make a map map_primitive for the polyline
    
	if (path_t == DTACK__GMAP__GIS_FEATURE_TYPE__IRREGULAR_AREA)
    {
      google_shape_object = new google.maps.Polygon({map: this.map});
      gis_style.set_polygon_options(google_shape_object);
      google_shape_object.setPath(latlng_array);
	}
	else
	if (path_t == DTACK__GMAP__GIS_FEATURE_TYPE__MULTI_SEGMENT_LINE)
    {
      google_shape_object = new google.maps.Polyline({map: this.map});
      gis_style.set_polyline_options(google_shape_object);
      google_shape_object.setPath(latlng_array);
	}                                                                               
  }
                                        // add to our list of map_primitives 
  this.register_map_primitive(google_shape_object, path_a, path_t);
  
} // end method
  
// -------------------------------------------------------------------------------

dtack__gmap__locus_c.prototype.make_gis_style = function($path)
{
  var F = "make_gis_style";
  
  var gis_style = null;
  
  var found = false;
  
  var feature_autoguid = $path.attr("a");
  if (feature_autoguid)
  {
    var $feature_attribute_packets = this.$definition.children("feature_attributes");
    if ($feature_attribute_packets.length > 0)
    {
      var $feature_attribute_packet = $feature_attribute_packets.children("[a=\"" + feature_autoguid + "\"]");
      
      if ($feature_attribute_packet.length > 0)
      {
	  	
	  	var style_autoguid = $feature_attribute_packet.children("style_autoguid").text();
	  	if (!style_autoguid)
	  	  style_autoguid = $feature_attribute_packet.children("s").text();
	  	
	  	if (style_autoguid)
	  	{
  	  	  var $gis_styles_packet = this.$definition.children("gis_styles");
	  	
	  	  if ($gis_styles_packet.length > 0)
	  	  {
	  	    var $gis_style_packet = $gis_styles_packet.children("[autoguid=\"" + style_autoguid + "\"]");
	  	    
	  	    if ($gis_style_packet.length > 0)
	  	    {
              gis_style = new dtack__gmap__style_c(this.dtack_environment);	  	      
              gis_style.initialize_from_xml($gis_style_packet);
	  	      this.debug_verbose(F, "found feature_attribute_packet style for feature_autoguid " + this.vts(feature_autoguid) +
	  	        " which is gis_style_autoguid " + this.vts(gis_style.autoguid));
			}
	        else
	        {
	  	      this.debug_verbose(F, "no gis_style packet for autoguid " + style_autoguid);
  	        }
		  }
	      else
	      {
	  	    this.debug_verbose(F, "no gis_styles packet for locus");
  	      }
		}
	    else
	    {
	  	  this.debug_verbose(F, "no style in feature attribute packet for feature " + feature_autoguid);
  	    }
	  }
	  else
	  {
	  	this.debug_verbose(F, "no feature_attribute_packet for " + feature_autoguid);
	  }
	}
	else
	{
	  this.debug_verbose(F, "no feature_attributes for locus");
	}
  }
  else
  {
	this.debug_verbose(F, "no feature autoguid on path");
  }
  
  return gis_style;
  
} // end method
                                    
// -------------------------------------------------------------------------------

dtack__gmap__locus_c.prototype.find_gis_style = function(options)
{
  var F = "find_gis_style";
  
  var gis_style = null;
  
  var found = false;

  this.assert("this.$definition is " + this.vts(this.$definition), this.$definition);
  
  var $gis_styles_packet = this.$definition.children("gis_styles");

  var that = this;
  
  if ($gis_styles_packet.length > 0)
  {
	var $gis_style_packet = $gis_styles_packet.children().each(
	  function()
	  {
	  	if (options.unique_name && options.unique_name == $(this).children("unique_name").text())
	  	{
  	      that.debug_verbose(F, "found gis_style with unique_name " + that.vts(options.unique_name));
	  	  found = true;
		}
		
		if (found)
		{
          gis_style = new dtack__gmap__style_c(that.dtack_environment);	  	      
          gis_style.initialize_from_xml($(this));
	  	  return false;
		}
		
		return true;
	  }
	);
	
  }
  else
  {
	this.debug_verbose(F, "no gis_styles packet for locus");
  }
  
  return gis_style;
  
} // end method
                                    
// -------------------------------------------------------------------------------
// map_primitive is a google object such as polyline or marker

dtack__gmap__locus_c.prototype.register_map_primitive = function(map_primitive, feature_id, feature_type, options)
{                                                                                  
  var F = "register_map_primitive";
  
  if (!map_primitive)
    return;
    
  map_primitive.set(DTACK__GMAP__GIS_FEATURE_TYPE, feature_type);
  
  var parent_autoguid = this.option_value(options, DTACK__GMAP__KEYWORDS__PARENT_AUTOGUID, undefined);
  map_primitive.set(DTACK__GMAP__KEYWORDS__PARENT_AUTOGUID, parent_autoguid);
  
                                        // the map_primitive needs to refer to its locus
                                        // this saves having to have a closure
  map_primitive.dtack__gmap = new Object();
  
  map_primitive.dtack__gmap.locus = this;
                                        // the map_primitive needs to know its feature
  map_primitive.dtack__gmap.feature_id = feature_id;
  
  if (!this.map_primitives)
    this.map_primitives = new Array();
  
  this.debug_verbose(F, "registering map primitive [" + this.map_primitives.length + "] " + this.vts(feature_id) +
    " with feature type " + this.vts(feature_type) +
    " and parent_autoid " + this.vts(parent_autoguid));
    
                                        // add to our list of map_primitives 
  this.map_primitives[this.map_primitives.length] = map_primitive;

  var that = this;
  
  google.maps.event.addListener(
    map_primitive, 
    "click", 
    function(event) 
    {
      that.debug(F + "-click", "map_primitive click");
      map_primitive.dtack__gmap.locus.handle_map_primitive_clicked(event, this);
    });

} // end method


// -------------------------------------------------------------------------------

dtack__gmap__locus_c.prototype.find_map_primitive = function(feature_id)
{
  var F = "dtack__gmap__locus_c::find_map_primitive";

  var map_primitive = null;
  
  if (this.map_primitives)
  {
    for(var k in this.map_primitives)
    {
  	  if (this.map_primitives[k].dtack__gmap.feature_id == feature_id)
  	  {
  	    map_primitive = this.map_primitives[k];
  	    break;
	  }
    }
  }
  
  return map_primitive;
} // end method

// -------------------------------------------------------------------------------

dtack__gmap__locus_c.prototype.remove_map_primitive = function(feature_id)
{
  var F = "dtack__gmap__locus_c::remove_map_primitive";

  var map_primitive = null;
  
  if (this.map_primitives)
  {
  	var n = this.map_primitives.length;
  	var j = 0;
    for(var i=0; i<n; i++)
    {
  	  if (this.map_primitives[i].dtack__gmap.feature_id == feature_id)
  	  {

        this.debug_verbose(F, "removing map primitive [" + i + "] " + this.vts(this.map_primitives[i].dtack__gmap.feature_id) +
          " with feature type " + this.vts(this.map_primitives[i].get(DTACK__GMAP__GIS_FEATURE_TYPE)));

  	    this.map_primitives[i].setMap(null);
  	    delete this.map_primitives[i];
	  }
	  else
	  {
	  	this.map_primitives[j++] = this.map_primitives[i];
	  }
    }
  }
  
  if (i > j)
    this.map_primitives.splice(j, i-j);
    
} // end method


// -------------------------------------------------------------------------------

dtack__gmap__locus_c.prototype.find_map_primitives_with_gis_style_autoguid = function(gis_style_autoguid)
{
  var F = "dtack__gmap__locus_c::find_map_primitives_with_gis_style_autoguid";

  var map_primitives = new Array();
  
  if (this.map_primitives)
  {
    for(var k in this.map_primitives)
    {
      var map_primitive = this.map_primitives[k];
      var gis_style = map_primitive.get(DTACK__GMAP__KEYWORDS__GIS_STYLE);
      if (gis_style)
      {
        if (gis_style.autoguid == gis_style_autoguid)
        {
          map_primitives.push(map_primitive);
		}
		else
		{
          this.debug_verbose(F, "primitive gis_style.autoguid " + this.vts(gis_style.autoguid) +
            " does not match " + this.vts(gis_style_autoguid));
		}
	  }
	  else
	  {
        //this.debug(F, "primitive gis_style is not defined");
	  }
    }
  }
  
  this.debug_verbose(F, 
    "from among " + this.map_primitives.length +
    " found " + map_primitives.length + " map primitives with gis_style_autoguid " + this.vts(gis_style_autoguid));
  
  return map_primitives;
} // end method

// -------------------------------------------------------------------------------

dtack__gmap__locus_c.prototype.find_map_primitives_with_parent_autoguid = function(parent_autoguid)
{
  var F = "dtack__gmap__locus_c::find_map_primitives_with_parent_autoguid";

  var map_primitives = new Array();
  
  if (this.map_primitives)
  {
    for(var k in this.map_primitives)
    {
      var map_primitive = this.map_primitives[k];
      var map_primitive_parent_autoguid = map_primitive.get(DTACK__GMAP__KEYWORDS__PARENT_AUTOGUID);
      if (map_primitive_parent_autoguid == parent_autoguid)
      {
        map_primitives.push(map_primitive);
	  }
	  else
	  {
          this.debug_verbose(F, "primitive parent_autoguid " + this.vts(map_primitive_parent_autoguid) +
            " does not match " + this.vts(parent_autoguid));
	  }
    }
  
    this.debug_verbose(F, 
      "from among " + this.map_primitives.length +
      " found " + map_primitives.length + " map primitives with parent_autoguid " + this.vts(parent_autoguid));
  }
  else
  {
    this.debug_verbose(F, 
      "no map primitives defined yet");
  }
  
  return map_primitives;
} // end method


// -------------------------------------------------------------------------------

dtack__gmap__locus_c.prototype.show_map_primitives = function(map_primitives)
{
  var F = "dtack__gmap__locus_c::show_map_primitives";
  
  if (map_primitives)
  {
  	this.debug_verbose(F, "showing " + map_primitives.length + " map primitives");
    for(var k in map_primitives)
    {
      var map_primitive = map_primitives[k];
      map_primitive.setMap(this.map);
    }
  }
} // end method

// -------------------------------------------------------------------------------

dtack__gmap__locus_c.prototype.hide_map_primitives = function(map_primitives)
{
  var F = "dtack__gmap__locus_c::hide_map_primitives";
  
  if (map_primitives)
  {
  	this.debug_verbose(F, "hiding " + map_primitives.length + " map primitives");
    for(var k in map_primitives)
    {
      var map_primitive = map_primitives[k];
      map_primitive.setMap(null);
    }
  }
} // end method

// -------------------------------------------------------------------------------

dtack__gmap__locus_c.prototype.dim_map_primitives = function(map_primitives, want_dim)
{
  var F = "dtack__gmap__locus_c::dim_map_primitives";
  
  if (map_primitives)
  {
  	this.debug_verbose(F, "dimming " + map_primitives.length + " map primitives");
    for(var k in map_primitives)
    {
      var map_primitive = map_primitives[k];
      	                                // reference the style the primitive was registered with
      var gis_style = map_primitive.get(DTACK__GMAP__KEYWORDS__GIS_STYLE);
      	                                // use the style to apply dim display attributes to the primitive
      gis_style.dim(map_primitive, want_dim);

      this.debug_verbose(F, "dimming map primitive [" + k + "] " + this.vts(map_primitive.dtack__gmap.feature_id) +
        " with feature type " + this.vts(map_primitive.get(DTACK__GMAP__GIS_FEATURE_TYPE)));
      
    }
  }
} // end method



                                                             
// -------------------------------------------------------------------------------

dtack__gmap__locus_c.prototype.activate_info_window = function(options)
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


dtack__gmap__locus_c.prototype.handle_map_primitive_clicked = function(event, map_primitive)
{
  var F = "dtack__gmap__locus_c::handle_map_primitive_clicked";
  
  map_primitive.dtack__gmap.clicked_latlng = this.serialize_latlng(event.latLng);
  
  //this.debug(F, "[CLICPRIM] map_primitive clicked with f=" + map_primitive.dtack__gmap.feature_id + " clicked_latlng=" + map_primitive.dtack__gmap.clicked_latlng);
  
  this.pull_triggers(
    dtack__gmap__locus_CONSTANTS.EVENTS.CLICKED_MAP_PRIMITIVE,
    map_primitive);
  
} // end method


// ----------------------------------------------------------------------------

dtack__gmap__locus_c.prototype.zoom_fit = function()
{
  var F = "dtack__gmap__locus_c::zoom_fit";

  if (this.map_primitives)
  {
  	//this.debug(F, "zooming to fit " + this.map_primitives.length + " map primitives");
  	
  	if (this.map_primitives.length)
  	{
  	  var map_primitives_bounds = new google.maps.LatLngBounds();
  	
      for(var k in this.map_primitives)
      {
        var map_primitive = this.map_primitives[k];
  
        var feature_type = map_primitive.get(DTACK__GMAP__GIS_FEATURE_TYPE);
    
        var map_primitive_bounds = null;
        
        switch(feature_type)
        {
  	      case DTACK__GMAP__GIS_FEATURE_TYPE__POINT: map_primitive_bounds = new google.maps.LatLngBounds(map_primitive.getPosition()); break;
  	      case DTACK__GMAP__GIS_FEATURE_TYPE__RECTANGLE: map_primitive_bounds = map_primitive.getBounds(); break;
  	      case DTACK__GMAP__GIS_FEATURE_TYPE__CIRCLE:  break;
  	      case DTACK__GMAP__GIS_FEATURE_TYPE__POLYLINE: 
  	      case DTACK__GMAP__GIS_FEATURE_TYPE__POLYGON: 
  	        map_primitive_bounds = new google.maps.LatLngBounds();
  	        map_primitive.getPath().forEach(function(element, index) {map_primitive_bounds.extend(element);});
  	      break;
        }
      
        map_primitives_bounds.union(map_primitive_bounds);
	  }
  
      this.map.fitBounds(map_primitives_bounds);
	}
  }
  
} // end method   