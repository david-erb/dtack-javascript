
// -------------------------------------------------------------------------------

dtack__gmap__editor_c.prototype.activate_polyline = function(options)
{
  var F = "activate_polyline";
  
  var that = this;
    
  this.attach_trigger(
    this.TRIGGER_EVENTS.POLYLINE_CHANGED, 
    function(trigger_object) {that.save_polyline(trigger_object)});
                                                               
                                       // handle the event where a new polyline got created by drawing it
  google.maps.event.addListener(this.drawing_manager, "polylinecomplete", 
    function(polyline) 
    {
      var F = "polylinecomplete";
      
      that.debug_polyline_verbose(F, "new polyline assigned autoguid " + that.autoguid_being_drawn);
      polyline.set(that.KEYWORDS.REAL_WORLD_DESCRIPTOR, that.real_world_descriptor_being_drawn);
      polyline.set(that.KEYWORDS.GIS_FEATURE_AUTOGUID, that.autoguid_being_drawn);
      polyline.set(DTACK__GMAP__KEYWORDS__GIS_STYLE, that.gis_style_being_drawn);
      
                                        // establish the new polyline as the object we are currently editing
      that.poke_google_object_under_edit(polyline, DTACK__GMAP__GIS_FEATURE_TYPE__POLYLINE);
                                
                                        // inform the user what the editor is doing
      that.inform_editing_polyline();

                                        // cause the ajax to send the update with the new location
      that.handle_polyline_changed(polyline);
      
                                        // make the new object editable on the map
      polyline.setEditable(true);
      polyline.setDraggable(true);
      
                                        // don't do any more drawing of new objects for now           
      that.drawing_manager.setOptions({drawingMode: null});

                                        // listen for change events on the polyline
      that.listen_polyline(polyline);
	}
  );  

} // end method

// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.deactivate_polyline = function(polyline)
{
  var F = "deactivate_polyline";
      
  if (!polyline)
    return;
    
  polyline.setEditable(false);
  polyline.setDraggable(false);
  this.unlisten_polyline(polyline);

} // end method

// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.edit_polyline = function(real_world_descriptor, autoguid, $gis_feature, gis_style, options)
{
  var F = "edit_polyline";
  
  if (!$gis_feature)
  {
    this.debug_polyline_verbose(F, "creating new polyline because $gis_feature is " + this.vts($gis_feature))
  	this.create_polyline(real_world_descriptor, autoguid, gis_style, options);
  	return;
  }
  
  this.debug_polyline_verbose(F, "editing existing polyline " + autoguid);
                                          
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
  
  this.debug_polyline_verbose(F, "found " + $feature_path_points.children().length + " points in path starting at " + x0 + ", " + y0);
  var path = new google.maps.MVCArray();
  $feature_path_points.children().each(
    function()
    {
      var dx = parseFloat($(this).find("x").text());
      var dy = parseFloat($(this).find("y").text());
      path.push(new google.maps.LatLng(y0 + dy, x0 + dx));
	}
  );
  
  
  var polyline = new google.maps.Polyline(
    {
      map: this.map_participants.peek_map(), 
      path: path,
      editable: true,
      draggable: true,
      zIndex: 1
    }
  );
                                  
  polyline.setOptions(gis_style.peek_polyline_options());
  
  this.debug_polyline_verbose(F, "gis_style edge_color is " + gis_style.edge_color);
  
  polyline.set(this.KEYWORDS.REAL_WORLD_DESCRIPTOR, real_world_descriptor);
  polyline.set(this.KEYWORDS.GIS_FEATURE_AUTOGUID, autoguid);
  polyline.set(DTACK__GMAP__KEYWORDS__GIS_STYLE, gis_style);
  
                                        // establish the object we are currently editing
  this.poke_google_object_under_edit(polyline, DTACK__GMAP__GIS_FEATURE_TYPE__POLYLINE);
                                                                                         
                                        // inform the user what the editor is doing
  this.inform_editing_polyline();

                                        // listen for change events on the polyline
  this.listen_polyline(polyline);

} // end method

// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.listen_polyline = function(polyline)
{
  var F = "listen_polyline";
              
  var that = this;
                
  google.maps.event.addListener(polyline.getPath(), "insert_at",
    function(event) 
    {
      that.handle_polyline_changed(polyline);
	}
  );

                                        // use rightclick on vertex to delete it   
  google.maps.event.addListener(polyline, "rightclick",
    function(event) 
    {
      if (event.vertex)
      {
        polyline.getPath().removeAt(event.vertex);
        that.handle_polyline_changed(polyline);
      }
    }
  );

//  google.maps.event.addListener(polyline.getPath(), "remove_at",
//    function(event) 
//    {
//      that.handle_polyline_changed(polyline);
//    }
//  );

  google.maps.event.addListener(polyline.getPath(), "set_at",
    function(event) 
    {
      if (!that.is_dragging)
      {
        that.handle_polyline_changed(polyline);
	  }
	}
  );

                                        // listen for edit events on the new polyline
  google.maps.event.addListener(polyline, "dragstart",
    function(event) 
    {
      that.debug_polyline_verbose(F, "got dragstart event");
      that.is_dragging = true;
	}
  );

                                        // listen for edit events on the new polyline
  google.maps.event.addListener(polyline, "dragend",
    function(event) 
    {
      that.debug_polyline_verbose(F, "got dragend event");
      that.handle_polyline_changed(polyline);
      that.is_dragging = false;
	}
  );

} // end method

// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.unlisten_polyline = function(polyline)
{
  var F = "unlisten_polyline";
              
  var that = this;
                
  google.maps.event.clearListeners(polyline.getPath(), "insert_at");
  google.maps.event.clearListeners(polyline.getPath(), "remove_at");
  google.maps.event.clearListeners(polyline.getPath(), "set_at");
  google.maps.event.clearListeners(polyline, "dragstart");
  google.maps.event.clearListeners(polyline, "dragend");

} // end method

// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.create_polyline = function(real_world_descriptor, autoguid, gis_style, options)
{
  var F = "create_polyline";

  var that = this;
                                        // stop editing and hide whatever else was being edited
  this.poke_google_object_under_edit(null);
                                          
  this.debug_polyline_verbose(F, "creating polyline with gis_style " + this.vts(gis_style));
  
                                        // remember the information of the thing we are drawing
  this.poke_feature_information(real_world_descriptor, autoguid, gis_style);
  
  this.drawing_manager.setOptions(
    {
      drawingMode: google.maps.drawing.OverlayType.POLYLINE,
	}
  );
                                        // let the button manager highlight the button for this mode            
  this.indicate_editing(DTACK__GMAP__GIS__TRIGGER_EVENTS__EDITING_POLYLINE);
                                                             
                                        // inform the user what the editor is doing
  this.inform("Creating a new google_object_under_edit.", "Please click where you want vertices, click in same spot twice to finish.");

                                        // turn on the drawing manager to draw the new thing
  this.drawing_manager.setMap(this.map_participants.peek_map());
  
                                        // establish the drawing style
  this.drawing_manager.setOptions({polylineOptions: gis_style.peek_polyline_options()});

} // end method


// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.delete_polyline = function(polyline)
{
  var F = "delete_polyline";
  	                                    // make a temporary (fake) polyline with empty geometry
  var empty_polyline = new google.maps.Polyline();
  
  	                                    // imbue with autoguid so the event can attach it to ajax
  empty_polyline.set(this.KEYWORDS.GIS_FEATURE_AUTOGUID, 
  	this.google_object_under_edit.get(this.KEYWORDS.GIS_FEATURE_AUTOGUID));
  	
    	                                // send the "change" to empty geometry
  this.handle_polyline_changed(empty_polyline);
  
  	                                    // prep the editor to draw a new polyline in the same autoguid and style
  this.create_polyline(
  	polyline.get(this.KEYWORDS.REAL_WORLD_DESCRIPTOR),
  	polyline.get(this.KEYWORDS.GIS_FEATURE_AUTOGUID),
  	polyline.get(DTACK__GMAP__KEYWORDS__GIS_STYLE));
  
} // end method


// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.handle_polyline_changed = function(polyline)
{
  var F = "handle_polyline_changed";

  this.debug_polyline_verbose(F, "seeing change on polyline " + 
    polyline.get(this.KEYWORDS.REAL_WORLD_DESCRIPTOR) + " " +
    polyline.get(this.KEYWORDS.GIS_FEATURE_AUTOGUID));
  try
  {
    this.pull_triggers(this.TRIGGER_EVENTS.POLYLINE_CHANGED, {polyline: polyline});
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
dtack__gmap__editor_c.prototype.inform_editing_polyline = function()
{
  var F = "inform_editing_polyline";
  
  this.inform("Editing google_object_under_edit.", "Please drag any vertex handle of the polyline as desired, or drag the entire polyline by dragging a line segment. Right-click vertex to remove it.");
                                                                                                            
                                        // let the button manager know the mode we are going in          
  this.pull_triggers(DTACK__GMAP__GIS__TRIGGER_EVENTS__EDITING_POLYLINE, null);

} // end method
                                             


// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.save_polyline = function(trigger_object)
{

  var F = "save_polyline";
    
  var options = new Object();
  
  var polyline = trigger_object.polyline;
  var x0 = 0;
  var y0 = 0;
  var x1 = 0;
  var y1 = 0;
  var xe = 0;
  var ye = 0;
  
  var points_xml = "";
  var path = polyline.getPath();
  var n = path.getLength();
  
  if (n > 0)
  {
  	                                    // figure out the bounding rectangle covering all the points
    var bounds = new google.maps.LatLngBounds();
    for(var i=0; i<n; i++)
    {
  	  bounds.extend(path.getAt(i));
    }
    
    x0 = bounds.getSouthWest().lng();
    y0 = bounds.getSouthWest().lat();
    x1 = bounds.getNorthEast().lng();
    y1 = bounds.getNorthEast().lat();
    
    var span = bounds.toSpan();
    xe = span.lng();
    ye = span.lat();
                                        // encode points as deltas from the bounds corner
    for(var i=0; i<n; i++)
    {
      var point = path.getAt(i);
	  var dx = point.lng() - x0;
	  var dy = point.lat() - y0;
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
    "<autoguid>" + polyline.get(this.KEYWORDS.GIS_FEATURE_AUTOGUID) + "</autoguid>" +
    "<type>" + DTACK__GMAP__GIS_FEATURE_TYPE__POLYLINE + "</type>" +
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

dtack__gmap__editor_c.prototype.debug_polyline_verbose = function(F, message)
{
  this.debug_verbose(F, message);
} // end method

