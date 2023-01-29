
// -------------------------------------------------------------------------------

dtack__gmap__editor_c.prototype.activate_circle = function(options)
{
  var F = "activate_circle";
  
  var that = this;
    
  this.attach_trigger(
    this.TRIGGER_EVENTS.CIRCLE_CHANGED, 
    function(trigger_object) {that.save_circle(trigger_object)});
                                                               
                                       // handle the event where a new circle got created by drawing it
  google.maps.event.addListener(this.drawing_manager, "circlecomplete", 
    function(circle) 
    {
      var F = "circlecomplete";
      
      that.debug(F, "new circle assigned autoguid " + that.autoguid_being_drawn);
      circle.set(that.KEYWORDS.REAL_WORLD_DESCRIPTOR, that.real_world_descriptor_being_drawn);
      circle.set(that.KEYWORDS.GIS_FEATURE_AUTOGUID, that.autoguid_being_drawn);
      circle.set(DTACK__GMAP__KEYWORDS__GIS_STYLE, that.gis_style_being_drawn);
      
                                        // establish the new circle as the object we are currently editing
      that.poke_google_object_under_edit(circle, DTACK__GMAP__GIS_FEATURE_TYPE__CIRCLE);
                                
                                        // inform the user what the editor is doing
      that.inform_editing_circle();

                                        // cause the ajax to send the update with the new location
      that.handle_circle_changed(circle);
      
                                        // make the new object editable on the map
      circle.setEditable(true);
      circle.setDraggable(true);
      
                                        // don't do any more drawing of new objects for now           
      that.drawing_manager.setOptions({drawingMode: null});

                                        // listen for edit events on the new circle
      google.maps.event.addListener(circle, "bounds_changed",
        function(event) 
        {
          that.handle_circle_changed(circle);
		}
	  );

                                        // listen for edit events on the new circle
      google.maps.event.addListener(circle, "dragend",
        function(event) 
        {
          that.handle_circle_changed(circle);
		}
	  );
	}
  );  

} // end method
                                                                          
// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.deactivate_circle = function(circle)
{
  var F = "deactivate_circle";
      
  if (!circle)
    return;
    
  circle.setEditable(false);
  circle.setDraggable(false);
  google.maps.event.clearListeners(circle, "bounds_changed");
  google.maps.event.clearListeners(circle, "dragend");

} // end method

// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.edit_circle = function(real_world_descriptor, autoguid, x0, y0, x1, y1, gis_style, options)
{
  var F = "edit_circle";
  
  if (isNaN(x0) || isNaN(x1) || x0 == x1)
  {
    this.debug(F, "creating new circle because x0 " + this.vts(x0) + " and x1 " + this.vts(x1))
  	this.create_circle(real_world_descriptor, autoguid, gis_style, options);
  	return;
  }
  this.debug(F, "editing existing circle with center at " + x0 + ", " + y0 + " and radius " + x1)
                                          
                                        // remember the information of the thing we are drawing
  this.poke_feature_information(real_world_descriptor, autoguid, gis_style);
                                                  
  var that = this;
  
  var circle = new google.maps.Circle(
    {
      map: this.map_participants.peek_map(), 
      center: new google.maps.LatLng(y0, x0),
      radius: x1,
      editable: true,
      draggable: true,
      zIndex: 1
    }
  );
                                  
  circle.setOptions(gis_style.peek_circle_options());
  
  this.debug(F, "editing existing circle " + autoguid);
  this.debug(F, "gis_style edge_color is " + gis_style.edge_color);
  
  circle.set(this.KEYWORDS.REAL_WORLD_DESCRIPTOR, real_world_descriptor);
  circle.set(this.KEYWORDS.GIS_FEATURE_AUTOGUID, autoguid);
  circle.set(DTACK__GMAP__KEYWORDS__GIS_STYLE, gis_style);
  
                                        // establish the object we are currently editing
  this.poke_google_object_under_edit(circle, DTACK__GMAP__GIS_FEATURE_TYPE__CIRCLE);
                                                                                         
                                        // inform the user what the editor is doing
  this.inform_editing_circle();

  google.maps.event.addListener(circle, "radius_changed",
    function(event) 
    {
      that.handle_circle_changed(circle);
	}
  );

                                        // listen for edit events on the new circle
  google.maps.event.addListener(circle, "dragend",
    function(event) 
    {
      that.handle_circle_changed(circle);
	}
  );

} // end method
                                                       
// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.create_circle = function(real_world_descriptor, autoguid, gis_style, options)
{
  var F = "create_circle";

  var that = this;
                                        // stop editing and hide whatever else was being edited
  this.poke_google_object_under_edit(null);
                                          
  this.debug(F, "creating circle with gis_style " + this.vts(gis_style));
  
                                        // remember the information of the thing we are drawing
  this.poke_feature_information(real_world_descriptor, autoguid, gis_style);
  
  this.drawing_manager.setOptions(
    {
      drawingMode: google.maps.drawing.OverlayType.CIRCLE,
	}
  );
                                        // let the button manager highlight the button for this mode            
  this.indicate_editing(DTACK__GMAP__GIS__TRIGGER_EVENTS__EDITING_CIRCLE);
                                                             
                                        // inform the user what the editor is doing
  this.inform("Creating a new google_object_under_edit.", "Please click-drag on the map to place it.");

                                        // turn on the drawing manager to draw the new thing
  this.drawing_manager.setMap(this.map_participants.peek_map());
  
                                        // establish the drawing style
  this.drawing_manager.setOptions({circleOptions: gis_style.peek_circle_options()});

} // end method


// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.delete_circle = function(circle)
{
  var F = "delete_circle";
  	                                    // make a temporary (fake) circle with empty geometry
  var empty_circle = new google.maps.Circle();
  
  	                                    // imbue with autoguid so the event can attach it to ajax
  empty_circle.set(this.KEYWORDS.GIS_FEATURE_AUTOGUID, 
  	this.google_object_under_edit.get(this.KEYWORDS.GIS_FEATURE_AUTOGUID));
  	
    	                                // send the "change" to empty geometry
  this.handle_circle_changed(empty_circle);
  
  	                                    // prep the editor to draw a new circle in the same autoguid and style
  this.create_circle(
  	circle.get(this.KEYWORDS.REAL_WORLD_DESCRIPTOR),
  	circle.get(this.KEYWORDS.GIS_FEATURE_AUTOGUID),
  	circle.get(DTACK__GMAP__KEYWORDS__GIS_STYLE));
  
} // end method


// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.handle_circle_changed = function(circle)
{
  var F = "handle_circle_changed";

  this.debug(F, "seeing change on circle " + 
    circle.get(this.KEYWORDS.REAL_WORLD_DESCRIPTOR) + " " +
    circle.get(this.KEYWORDS.GIS_FEATURE_AUTOGUID));
  try
  {
    this.pull_triggers(this.TRIGGER_EVENTS.CIRCLE_CHANGED, {circle: circle});
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
dtack__gmap__editor_c.prototype.inform_editing_circle = function()
{
  var F = "inform_editing_circle";
  
  this.inform("Editing google_object_under_edit.", "Please drag any edge handle of the circle as desired, or drag the entire circle.");
                                                                                                            
                                        // let the button manager know the mode we are going in          
  this.pull_triggers(DTACK__GMAP__GIS__TRIGGER_EVENTS__EDITING_CIRCLE, null);

} // end method
                                             


// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.save_circle = function(trigger_object)
{

  var F = "save_circle";
    
  var options = new Object();
  
  var circle = trigger_object.circle;

  var x0 = circle.getCenter().lng();
  var y0 = circle.getCenter().lat();
  var x1 = circle.getRadius();
  var y1 = x1;
  var xe = x1;
  var ye = x1;
                                    
  this.ajax_issuer.issue_command(
    "update_gis_feature", 
    "<feature>" +
    "<autoguid>" + circle.get(this.KEYWORDS.GIS_FEATURE_AUTOGUID) + "</autoguid>" +
    "<type>" + DTACK__GMAP__GIS_FEATURE_TYPE__CIRCLE + "</type>" +
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