
// -------------------------------------------------------------------------------

dtack__gmap__editor_c.prototype.activate_polygon = function(options)
{
  var F = "activate_polygon";
  
  var that = this;
    
  this.attach_trigger(
    this.TRIGGER_EVENTS.POLYGON_CHANGED, 
    function(trigger_object) {that.save_polygon(trigger_object)});
                                                               
                                       // handle the event where a new polygon got created by drawing it
  google.maps.event.addListener(this.drawing_manager, "polygoncomplete", 
    function(polygon) 
    {
      var F = "polygoncomplete";
      
      that.debug_polygon_verbose(F, "new polygon assigned autoguid " + that.autoguid_being_drawn);
      polygon.set(that.KEYWORDS.REAL_WORLD_DESCRIPTOR, that.real_world_descriptor_being_drawn);
      polygon.set(that.KEYWORDS.GIS_FEATURE_AUTOGUID, that.autoguid_being_drawn);
      polygon.set(DTACK__GMAP__KEYWORDS__GIS_STYLE, that.gis_style_being_drawn);
      
                                        // establish the new polygon as the object we are currently editing
      that.poke_google_object_under_edit(polygon, DTACK__GMAP__GIS_FEATURE_TYPE__POLYGON);
                                
                                        // inform the user what the editor is doing
      that.inform_editing_polygon();

                                        // cause the ajax to send the update with the new location
      that.handle_polygon_changed(polygon);
      
                                        // make the new object editable on the map
      polygon.setEditable(true);
      polygon.setDraggable(true);
      
                                        // don't do any more drawing of new objects for now           
      that.drawing_manager.setOptions({drawingMode: null});

                                        // listen for change events on the polygon
      that.listen_polygon(polygon);
	}
  );  

} // end method

// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.deactivate_polygon = function(polygon)
{
  var F = "deactivate_polygon";
      
  if (!polygon)
    return;
    
  polygon.setEditable(false);
  polygon.setDraggable(false);
  this.unlisten_polygon(polygon);

} // end method

// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.edit_polygon = function(real_world_descriptor, autoguid, $gis_feature, gis_style, options)
{
  var F = "edit_polygon";
  
  if (!$gis_feature)
  {
    this.debug_polygon_verbose(F, "creating new polygon because $gis_feature is " + this.vts($gis_feature))
  	this.create_polygon(real_world_descriptor, autoguid, gis_style, options);
  	return;
  }
  
  this.debug_polygon_verbose(F, "editing existing polygon " + autoguid);
                                          
                                        // remember the information of the thing we are drawing
  this.poke_feature_information(real_world_descriptor, autoguid, gis_style);
                                                  
  var that = this;
  
  var $feature_paths = $gis_feature.find("feature_paths");
  
                                        // for now, presume single path per feature
  var $feature_path = $feature_paths.find("feature_path");
  var $feature_path_points = $feature_path.find("feature_path_points");
  
                                        // corner of the path's bounds
  var x0 = parseFloat($feature_path.attr("x0"));
  var y0 = parseFloat($feature_path.attr("y0"));
  
  this.debug_polygon_verbose(F, "found " + $feature_path_points.children().length + " points in path starting at " + x0 + ", " + y0);
  var path = new google.maps.MVCArray();
  $feature_path_points.children().each(
    function()
    {
      var dx = parseFloat($(this).find("x").text());
      var dy = parseFloat($(this).find("y").text());
      path.push(new google.maps.LatLng(y0 + dy, x0 + dx));
	}
  );
  
  
  var polygon = new google.maps.Polygon(
    {
      map: this.map_participants.peek_map(), 
      path: path,
      editable: true,
      draggable: true,
      zIndex: 1
    }
  );
                                  
  polygon.setOptions(gis_style.peek_polygon_options());
  
  this.debug_polygon_verbose(F, "gis_style edge_color is " + gis_style.edge_color);
  
  polygon.set(this.KEYWORDS.REAL_WORLD_DESCRIPTOR, real_world_descriptor);
  polygon.set(this.KEYWORDS.GIS_FEATURE_AUTOGUID, autoguid);
  polygon.set(DTACK__GMAP__KEYWORDS__GIS_STYLE, gis_style);
  
                                        // establish the object we are currently editing
  this.poke_google_object_under_edit(polygon, DTACK__GMAP__GIS_FEATURE_TYPE__POLYGON);
                                                                                         
                                        // inform the user what the editor is doing
  this.inform_editing_polygon();

                                        // listen for change events on the polygon
  this.listen_polygon(polygon);
  
} // end method

// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.listen_polygon = function(polygon)
{
  var F = "listen_polygon";
              
  var that = this;
                
  google.maps.event.addListener(polygon.getPath(), "insert_at",
    function(event) 
    {
      that.handle_polygon_changed(polygon);
	}
  );

                                        // use rightclick on vertex to delete it   
  google.maps.event.addListener(polygon, "rightclick",
    function(event) 
    {
      if (event.vertex)
      {
        polygon.getPath().removeAt(event.vertex);
        that.handle_polygon_changed(polygon);
      }
    }
  );

//  google.maps.event.addListener(polygon.getPath(), "remove_at",
//    function(event) 
//    {
//      that.handle_polygon_changed(polygon);
//	}
//  );

  google.maps.event.addListener(polygon.getPath(), "set_at",
    function(event) 
    {
      if (!that.is_dragging)
      {
        that.handle_polygon_changed(polygon);
	  }
	}
  );

                                        // listen for edit events on the new polygon
  google.maps.event.addListener(polygon, "dragstart",
    function(event) 
    {
      that.debug_polygon_verbose(F, "got dragstart event");
      that.is_dragging = true;
	}
  );

                                        // listen for edit events on the new polygon
  google.maps.event.addListener(polygon, "dragend",
    function(event) 
    {
      that.debug_polygon_verbose(F, "got dragend event");
      that.handle_polygon_changed(polygon);
      that.is_dragging = false;
	}
  );

} // end method

// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.unlisten_polygon = function(polygon)
{
  var F = "unlisten_polygon";
              
  var that = this;
                
  google.maps.event.clearListeners(polygon.getPath(), "insert_at");
  google.maps.event.clearListeners(polygon.getPath(), "remove_at");
  google.maps.event.clearListeners(polygon.getPath(), "set_at");
  google.maps.event.clearListeners(polygon, "dragstart");
  google.maps.event.clearListeners(polygon, "dragend");

} // end method

// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.create_polygon = function(real_world_descriptor, autoguid, gis_style, options)
{
  var F = "create_polygon";

  var that = this;
                                        // stop editing and hide whatever else was being edited
  this.poke_google_object_under_edit(null);
                                          
  this.debug_polygon_verbose(F, "creating polygon with gis_style " + this.vts(gis_style));
  
                                        // remember the information of the thing we are drawing
  this.poke_feature_information(real_world_descriptor, autoguid, gis_style);
  
  this.drawing_manager.setOptions(
    {
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
	}
  );
                                        // let the button manager highlight the button for this mode            
  this.indicate_editing(DTACK__GMAP__GIS__TRIGGER_EVENTS__EDITING_POLYGON);
                                                             
                                        // inform the user what the editor is doing
  this.inform("Creating a new google_object_under_edit.", "Please click where you want vertices, click in same spot twice or click near the start to finish.");

                                        // turn on the drawing manager to draw the new thing
  this.drawing_manager.setMap(this.map_participants.peek_map());
  
                                        // establish the drawing style
  this.drawing_manager.setOptions({polygonOptions: gis_style.peek_polygon_options()});

} // end method


// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.delete_polygon = function(polygon)
{
  var F = "delete_polygon";
  	                                    // make a temporary (fake) polygon with empty geometry
  var empty_polygon = new google.maps.Polygon();
  
  	                                    // imbue with autoguid so the event can attach it to ajax
  empty_polygon.set(this.KEYWORDS.GIS_FEATURE_AUTOGUID, 
  	this.google_object_under_edit.get(this.KEYWORDS.GIS_FEATURE_AUTOGUID));
  	
    	                                // send the "change" to empty geometry
  this.handle_polygon_changed(empty_polygon);
  
  	                                    // prep the editor to draw a new polygon in the same autoguid and style
  this.create_polygon(
  	polygon.get(this.KEYWORDS.REAL_WORLD_DESCRIPTOR),
  	polygon.get(this.KEYWORDS.GIS_FEATURE_AUTOGUID),
  	polygon.get(DTACK__GMAP__KEYWORDS__GIS_STYLE));
  
} // end method


// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.handle_polygon_changed = function(polygon)
{
  var F = "handle_polygon_changed";

  this.debug_polygon_verbose(F, "seeing change on polygon " + 
    polygon.get(this.KEYWORDS.REAL_WORLD_DESCRIPTOR) + " " +
    polygon.get(this.KEYWORDS.GIS_FEATURE_AUTOGUID));
  try
  {
    this.pull_triggers(this.TRIGGER_EVENTS.POLYGON_CHANGED, {polygon: polygon});
  }
  catch(exception)
  {
  	var message = exception;
    if (exception.name != undefined)
	  message = exception.name + ": " + exception.message;
    this.debug(F, "failed to pull triggers: " + message);
  }
  
} // end method

// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.inform_editing_polygon = function()
{
  var F = "inform_editing_polygon";
  
  this.inform("Editing google_object_under_edit.", "Please drag any vertex handle of the polygon as desired, or drag the entire polygon by dragging a line segment. Right-click vertex to remove it.");
                                                                                                            
                                        // let the button manager know the mode we are going in          
  this.pull_triggers(DTACK__GMAP__GIS__TRIGGER_EVENTS__EDITING_POLYGON, null);

} // end method
                                             


// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.save_polygon = function(trigger_object)
{

  var F = "save_polygon";
    
  var options = new Object();
  
  var polygon = trigger_object.polygon;
  var x0 = 0;
  var y0 = 0;
  var x1 = 0;
  var y1 = 0;
  var xe = 0;
  var ye = 0;
  
  var points_xml = "";
  var path = polygon.getPath().getArray();
  
  if (path.length > 0)
  {
  	                                    // figure out the bounding rectangle covering all the points
    var bounds = new google.maps.LatLngBounds();
    for(var k in path)
    {
  	  bounds.extend(path[k]);
    }
    
    x0 = bounds.getSouthWest().lng();
    y0 = bounds.getSouthWest().lat();
    x1 = bounds.getNorthEast().lng();
    y1 = bounds.getNorthEast().lat();
    
    var span = bounds.toSpan();
    xe = span.lng();
    ye = span.lat();
                                        // encode points as deltas from the bounds corner
    for(var k in path)
    {
	  var dx = path[k].lng() - x0;
	  var dy = path[k].lat() - y0;
	  points_xml += "<p><x>" + dx + "</x><y>" + dy + "</y></p>";
    }
  }
                                        // bounds of the feature 
  var rectangle_xml =
    "<x0>" + x0 + "</x0>" +
    "<y0>" + y0 + "</y0>" +
    "<x1>" + x1 + "</x1>" +
    "<y1>" + y1 + "</y1>" +
    "<xe>" + xe + "</xe>" +
    "<ye>" + ye + "</ye>";
    
  this.ajax_issuer.issue_command(
    "update_gis_feature", 
    "<feature>" +
    "<autoguid>" + polygon.get(this.KEYWORDS.GIS_FEATURE_AUTOGUID) + "</autoguid>" +
    "<type>" + DTACK__GMAP__GIS_FEATURE_TYPE__POLYGON + "</type>" +
    "<type>" + DTACK__GMAP__GIS_FEATURE_TYPE__POLYGON + "</type>" +
    rectangle_xml +
    "<feature_paths>" +
    "<feature_path>" +
                                        // server will assign actual autoguid as part of feature geometry update
    "<autoguid></autoguid>" +
                                        // since single path, it has the same bounds as the feature itself
    rectangle_xml +
    "<feature_path_points>" + points_xml + "</feature_path_points>" +
    "</feature_path>" +
    "</feature_paths>" +
    "</feature>",
    null, 
    null, 
    options);
  
} // end method


// -------------------------------------------------------------------------------

dtack__gmap__editor_c.prototype.debug_polygon_verbose = function(F, message)
{
  //this.debug(F, message);
} // end method

