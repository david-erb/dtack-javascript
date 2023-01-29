
// -------------------------------------------------------------------------------

dtack__gmap__editor_c.prototype.activate_marker = function(options)
{
  var F = "activate_marker";
  
  var that = this;
  
  this.attach_trigger(
    this.TRIGGER_EVENTS.MARKER_CHANGED, 
    function(trigger_object) {that.save_marker(trigger_object)});
      
                                        // inform the user what the editor is doing
  that.inform_editing_marker();
  
                                        // handle the event where a new marker got created by drawing it
  google.maps.event.addListener(this.drawing_manager, "markercomplete", 
    function(marker) 
    {
      var F = "markercomplete";
      
      that.debug(F, "new marker assigned autoguid " + that.autoguid_being_drawn);
      marker.set(that.KEYWORDS.REAL_WORLD_DESCRIPTOR, that.real_world_descriptor_being_drawn);
      marker.set(that.KEYWORDS.GIS_FEATURE_AUTOGUID, that.autoguid_being_drawn);
      marker.set(DTACK__GMAP__KEYWORDS__GIS_STYLE, that.gis_style_being_drawn);
      
                                        // establish the new marker as the object we are currently editing
      that.poke_google_object_under_edit(marker, DTACK__GMAP__GIS_FEATURE_TYPE__POINT);
      
                                        // cause the ajax to send the update with the new location
      that.handle_marker_changed(marker);
      
                                        // make the new object draggable on the map
      marker.setDraggable(true);
      
                                        // don't do any more drawing of new objects for now           
      that.drawing_manager.setOptions({drawingMode: null});

                                        // listen for edit events on the new marker
      google.maps.event.addListener(marker, "dragend",
        function(event) 
        {
          that.handle_marker_changed(marker);
		}
	  );
	}
  );  

} // end method
                                                                                              
// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.deactivate_marker = function(marker)
{
  var F = "deactivate_marker";
      
  if (!marker)
    return;
    
  marker.setDraggable(false);
  google.maps.event.clearListeners(marker, "dragend");

} // end method

// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.edit_marker = function(real_world_descriptor, autoguid, x, y, gis_style, options)
{
  var F = "edit_marker";
  
  if (isNaN(x) || isNaN(y) || x == 0 || y == 0 || x == y)
  {
  	this.create_marker(real_world_descriptor, autoguid, gis_style, options);
  	return;
  }
                                                 
                                        // remember the information of the thing we are drawing
  this.poke_feature_information(real_world_descriptor, autoguid, gis_style);

  var that = this;
  
  var marker = new google.maps.Marker(
    {
      map: this.map_participants.peek_map(), 
      position: new google.maps.LatLng(y, x),
      draggable: true
    }
  );
                                  
  marker.setOptions(gis_style.peek_marker_options());
  
  this.debug_verbose(F, "editing existing marker " + autoguid);
  this.debug_verbose(F, "gis_style icon is " + gis_style.icon);
  
  marker.set(this.KEYWORDS.REAL_WORLD_DESCRIPTOR, real_world_descriptor);
  marker.set(this.KEYWORDS.GIS_FEATURE_AUTOGUID, autoguid);
  marker.set(DTACK__GMAP__KEYWORDS__GIS_STYLE, gis_style);
  
                                        // establish the object we are currently editing
  this.poke_google_object_under_edit(marker, DTACK__GMAP__GIS_FEATURE_TYPE__POINT);
  
                                        // inform the user what the editor is doing
  this.inform_editing_marker();

  google.maps.event.addListener(marker, "dragend",
    function(event) 
    {
      that.handle_marker_changed(marker);
	}
  );

} // end method

// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.create_marker = function(real_world_descriptor, autoguid, gis_style, options)
{
  var F = "create_marker";

  this.debug(F, "drawing new marker " + autoguid);

  var that = this;
                                        // stop editing and hide whatever else was being edited
  this.poke_google_object_under_edit(null);
                             
                                        // remember the information of the thing we are drawing
  this.poke_feature_information(real_world_descriptor, autoguid, gis_style);

  this.drawing_manager.setOptions(
    {
      drawingMode: google.maps.drawing.OverlayType.MARKER,
	}
  );
                                        // let the button manager highlight the button for this mode            
  this.indicate_editing(DTACK__GMAP__GIS__TRIGGER_EVENTS__EDITING_MARKER);
                                                    
  this.inform("Creating a new google_object_under_edit.", "Please click on the map to place it.");

                                        // turn on the drawing manager to draw the new thing
  this.drawing_manager.setMap(this.map_participants.peek_map());
  
                                        // establish the drawing style
  this.drawing_manager.setOptions({markerOptions: gis_style.peek_marker_options()});
  
} // end method


// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.delete_marker = function(marker)
{
  var F = "delete_marker";
  	                                    // make a temporary (fake) marker with empty geometry
  var empty_marker = new google.maps.Marker();
  
  	                                    // imbue with autoguid so the event can attach it to ajax
  empty_marker.set(this.KEYWORDS.GIS_FEATURE_AUTOGUID, 
  	this.google_object_under_edit.get(this.KEYWORDS.GIS_FEATURE_AUTOGUID));
  	
    	                                // send the "change" to empty geometry
  this.handle_marker_changed(empty_marker);
  
  	                                    // prep the editor to draw a new marker in the same autoguid and style
  this.create_marker(
  	marker.get(this.KEYWORDS.REAL_WORLD_DESCRIPTOR),
  	marker.get(this.KEYWORDS.GIS_FEATURE_AUTOGUID),
  	marker.get(DTACK__GMAP__KEYWORDS__GIS_STYLE));
  
} // end method


// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.handle_marker_changed = function(marker)
{
  var F = "handle_marker_changed";

  this.debug(F, "seeing change on marker " + 
    marker.get(this.KEYWORDS.REAL_WORLD_DESCRIPTOR) + " " +
    marker.get(this.KEYWORDS.GIS_FEATURE_AUTOGUID));
  try
  {
    this.pull_triggers(this.TRIGGER_EVENTS.MARKER_CHANGED, {marker: marker});
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
dtack__gmap__editor_c.prototype.inform_editing_marker = function()
{
  var F = "inform_editing_marker";
  
  this.inform("Editing google_object_under_edit.", "Please drag the marker to move it to a new position.");
                                                  
                                        // let the button manager know the mode we are going in          
  this.pull_triggers(DTACK__GMAP__GIS__TRIGGER_EVENTS__EDITING_MARKER, null);

} // end method
                                                         
                                                         
        
// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.save_marker = function(trigger_object)
{

  var F = "save_marker";
    
  var options = new Object();
  
  var marker = trigger_object.marker;
  var position = marker.getPosition();
  var x0 = 0;
  var y0 = 0;
  var x1 = 0;
  var y1 = 0;
  var xe = 0;
  var ye = 0;
  if (position)
  {
    x0 = position.lng();
    y0 = position.lat();
    x1 = position.lng();
    y1 = position.lat();
  }
                                    
  this.ajax_issuer.issue_command(
    "update_gis_feature", 
    "<feature>" +
    "<autoguid>" + marker.get(this.KEYWORDS.GIS_FEATURE_AUTOGUID) + "</autoguid>" +
    "<type>" + DTACK__GMAP__GIS_FEATURE_TYPE__POINT + "</type>" +
    "<x0>" + x0 + "</x0>" +
    "<y0>" + y0 + "</y0>" +
    "<x1>" + x1 + "</x1>" +
    "<y1>" + y1 + "</y1>" +
    "<xe>" + xe + "</xe>" +
    "<ye>" + ye + "</ye>" +
    "</feature>",
    null, 
    null, 
    options);
  
} // end method
                                                         