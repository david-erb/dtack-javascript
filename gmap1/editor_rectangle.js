
// -------------------------------------------------------------------------------

dtack__gmap__editor_c.prototype.activate_rectangle = function(options)
{
  var F = "activate_rectangle";
  
  var that = this;
    
  this.attach_trigger(
    this.TRIGGER_EVENTS.RECTANGLE_CHANGED, 
    function(trigger_object) {that.save_rectangle(trigger_object)});
                                                               
                                       // handle the event where a new rectangle got created by drawing it
  google.maps.event.addListener(this.drawing_manager, "rectanglecomplete", 
    function(rectangle) 
    {
      var F = "rectanglecomplete";
      
      that.debug(F, "new rectangle assigned autoguid " + that.autoguid_being_drawn);
      rectangle.set(that.KEYWORDS.REAL_WORLD_DESCRIPTOR, that.real_world_descriptor_being_drawn);
      rectangle.set(that.KEYWORDS.GIS_FEATURE_AUTOGUID, that.autoguid_being_drawn);
      rectangle.set(DTACK__GMAP__KEYWORDS__GIS_STYLE, that.gis_style_being_drawn);
      
                                        // establish the new rectangle as the object we are currently editing
      that.poke_google_object_under_edit(rectangle, DTACK__GMAP__GIS_FEATURE_TYPE__RECTANGLE);
                                
                                        // inform the user what the editor is doing
      that.inform_editing_rectangle();

                                        // cause the ajax to send the update with the new location
      that.handle_rectangle_changed(rectangle);
      
                                        // make the new object editable on the map
      rectangle.setEditable(true);
      rectangle.setDraggable(true);
      
                                        // don't do any more drawing of new objects for now           
      that.drawing_manager.setOptions({drawingMode: null});

                                        // listen for edit events on the new rectangle
      google.maps.event.addListener(rectangle, "bounds_changed",
        function(event) 
        {
          that.handle_rectangle_changed(rectangle);
		}
	  );

                                        // listen for edit events on the new rectangle
      google.maps.event.addListener(rectangle, "dragend",
        function(event) 
        {
          that.handle_rectangle_changed(rectangle);
		}
	  );
	}
  );  

} // end method

// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.deactivate_rectangle = function(rectangle)
{
  var F = "deactivate_rectangle";
      
  if (!rectangle)
    return;
    
  rectangle.setEditable(false);
  rectangle.setDraggable(false);
  google.maps.event.clearListeners(rectangle, "bounds_changed");
  google.maps.event.clearListeners(rectangle, "dragend");

} // end method

// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.edit_rectangle = function(real_world_descriptor, autoguid, x0, y0, x1, y1, gis_style, options)
{
  var F = "edit_rectangle";
  
  if (isNaN(x0) || isNaN(x1) || x0 == x1)
  {
  	this.create_rectangle(real_world_descriptor, autoguid, gis_style, options);
  	return;
  }
                                          
                                        // remember the information of the thing we are drawing
  this.poke_feature_information(real_world_descriptor, autoguid, gis_style);
                                                  
  var that = this;

  var bounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(y0, x0),
    new google.maps.LatLng(y1, x1));
  
  var rectangle = new google.maps.Rectangle(
    {
      map: this.map_participants.peek_map(), 
      bounds: bounds,
      editable: true,
      draggable: true,
      zIndex: 1
    }
  );
                                  
  rectangle.setOptions(gis_style.peek_rectangle_options());
  
  this.debug_rectangle_verbose(F, "editing existing rectangle " + autoguid);
  this.debug_rectangle_verbose(F, "gis_style edge_color is " + gis_style.edge_color);
  
  rectangle.set(this.KEYWORDS.REAL_WORLD_DESCRIPTOR, real_world_descriptor);
  rectangle.set(this.KEYWORDS.GIS_FEATURE_AUTOGUID, autoguid);
  rectangle.set(DTACK__GMAP__KEYWORDS__GIS_STYLE, gis_style);
  
                                        // establish the object we are currently editing
  this.poke_google_object_under_edit(rectangle, DTACK__GMAP__GIS_FEATURE_TYPE__RECTANGLE);
                                                                                         
                                        // inform the user what the editor is doing
  this.inform_editing_rectangle();

  google.maps.event.addListener(rectangle, "bounds_changed",
    function(event) 
    {
      that.handle_rectangle_changed(rectangle);
	}
  );

                                        // listen for edit events on the new rectangle
  google.maps.event.addListener(rectangle, "dragend",
    function(event) 
    {
      that.handle_rectangle_changed(rectangle);
	}
  );

} // end method

// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.create_rectangle = function(real_world_descriptor, autoguid, gis_style, options)
{
  var F = "create_rectangle";

  var that = this;
                                        // stop editing and hide whatever else was being edited
  this.poke_google_object_under_edit(null);
                                          
                                        // remember the information of the thing we are drawing
  this.poke_feature_information(real_world_descriptor, autoguid, gis_style);
  
  this.drawing_manager.setOptions(
    {
      drawingMode: google.maps.drawing.OverlayType.RECTANGLE,
	}
  );
                                        // let the button manager highlight the button for this mode            
  this.indicate_editing(DTACK__GMAP__GIS__TRIGGER_EVENTS__EDITING_RECTANGLE);
                                                             
                                        // inform the user what the editor is doing
  this.inform("Creating a new google_object_under_edit.", "Please click-drag on the map to place it.");

                                        // turn on the drawing manager to draw the new thing
  this.drawing_manager.setMap(this.map_participants.peek_map());
  
                                        // establish the drawing style
  this.drawing_manager.setOptions({rectangleOptions: gis_style.peek_rectangle_options()});

} // end method


// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.delete_rectangle = function(rectangle)
{
  var F = "delete_rectangle";
  	                                    // make a temporary (fake) rectangle with empty geometry
  var empty_rectangle = new google.maps.Rectangle();
  
  	                                    // imbue with autoguid so the event can attach it to ajax
  empty_rectangle.set(this.KEYWORDS.GIS_FEATURE_AUTOGUID, 
  	this.google_object_under_edit.get(this.KEYWORDS.GIS_FEATURE_AUTOGUID));
  	
    	                                // send the "change" to empty geometry
  this.handle_rectangle_changed(empty_rectangle);
  
  	                                    // prep the editor to draw a new rectangle in the same autoguid and style
  this.create_rectangle(
  	rectangle.get(this.KEYWORDS.REAL_WORLD_DESCRIPTOR),
  	rectangle.get(this.KEYWORDS.GIS_FEATURE_AUTOGUID),
  	rectangle.get(DTACK__GMAP__KEYWORDS__GIS_STYLE));
  
} // end method


// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.handle_rectangle_changed = function(rectangle)
{
  var F = "handle_rectangle_changed";

  this.debug_rectangle_verbose(F, "seeing change on rectangle " + 
    rectangle.get(this.KEYWORDS.REAL_WORLD_DESCRIPTOR) + " " +
    rectangle.get(this.KEYWORDS.GIS_FEATURE_AUTOGUID));
  try
  {
    this.pull_triggers(this.TRIGGER_EVENTS.RECTANGLE_CHANGED, {rectangle: rectangle});
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
dtack__gmap__editor_c.prototype.inform_editing_rectangle = function()
{
  var F = "inform_editing_rectangle";
  
  this.inform("Editing google_object_under_edit.", "Please drag any corner or edge handle of the rectangle as desired, or drag the entire rectangle.");
                                                                                                            
                                        // let the button manager know the mode we are going in          
  this.pull_triggers(DTACK__GMAP__GIS__TRIGGER_EVENTS__EDITING_RECTANGLE, null);

} // end method
                                             


// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.save_rectangle = function(trigger_object)
{

  var F = "save_rectangle";
    
  var options = new Object();
  
  var rectangle = trigger_object.rectangle;
  var bounds = rectangle.getBounds();
  var x0 = 0;
  var y0 = 0;
  var x1 = 0;
  var y1 = 0;
  var xe = 0;
  var ye = 0;
  if (bounds)
  {
    x0 = bounds.getSouthWest().lng();
    y0 = bounds.getSouthWest().lat();
    x1 = bounds.getNorthEast().lng();
    y1 = bounds.getNorthEast().lat();
    
    var span = bounds.toSpan();
    xe = span.lng();
    ye = span.lat();
  }
                                    
  this.ajax_issuer.issue_command(
    "update_gis_feature", 
    "<feature>" +
    "<autoguid>" + rectangle.get(this.KEYWORDS.GIS_FEATURE_AUTOGUID) + "</autoguid>" +
    "<type>" + DTACK__GMAP__GIS_FEATURE_TYPE__RECTANGLE + "</type>" +
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

// -------------------------------------------------------------------------------

dtack__gmap__editor_c.prototype.debug_rectangle_verbose = function(F, message)
{
  //this.debug(F, message);
} // end method

