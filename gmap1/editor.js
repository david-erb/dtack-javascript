// --------------------------------------------------------------------

										// inherit the base methods and variables
dtack__gmap__editor_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack__gmap__editor_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
dtack__gmap__editor_c.prototype.constructor = dtack__gmap__editor_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__gmap__editor_c(page_object, $dashboard, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__gmap__editor_c";

										/* call the base class constructor helper */
	dtack__gmap__editor_c.prototype.base.constructor.call(
	  this,
	  page_object.dtack_environment,
	  classname != undefined? classname: F);
  }
  
  this.page_object = page_object;
  this.ajax_issuer = this.page_object.ajax_issuer;
  this.$dashboard = $dashboard;
  
  this.TRIGGER_EVENTS =
    {                                                        
      MARKER_CHANGED: "dtack__gmap__editor_c::MARKER_CHANGED",
      RECTANGLE_CHANGED: "dtack__gmap__editor_c::RECTANGLE_CHANGED",
      CIRCLE_CHANGED: "dtack__gmap__editor_c::CIRCLE_CHANGED",
      POLYLINE_CHANGED: "dtack__gmap__editor_c::POLYLINE_CHANGED",
      POLYGON_CHANGED: "dtack__gmap__editor_c::POLYGON_CHANGED",
      DRAW_BUTTON_CLICKED: "dtack__gmap__editor_c::DRAW_BUTTON_CLICKED",
      APPLY_CLICKED: "dtack__gmap__editor_c::APPLY_CLICKED"
	};
	
  this.KEYWORDS =
    {
      PRIMITIVE_TYPE: "PRIMITIVE_TYPE",
      REAL_WORLD_DESCRIPTOR: "REAL_WORLD_DESCRIPTOR",
      GIS_FEATURE_AUTOGUID: "GIS_FEATURE_AUTOGUID"
	};
	
  this.google_object_under_edit = null;
  
} // end constructor


// -------------------------------------------------------------------------------

dtack__gmap__editor_c.prototype.activate = function(map_participants, options)
{
  var F = "activate";

  this.map_participants = map_participants;
  
  var that = this;
  
  this.$doing_div = $(".T_doing", this.$dashboard);
  
  this.$draw_button = $(".T_tool.T_draw", this.$dashboard);
  this.$draw_button.click(function(event) {that.pull_triggers(that.TRIGGER_EVENTS.DRAW_BUTTON_CLICKED, null);});

  
  this.$remove_button = $(".T_tool.T_remove", this.$dashboard);
  this.$remove_button.click(function(event) {that.handle_remove_button_clicked(event);});

  
  this.$apply_button = $(".T_tool.T_apply", this.$dashboard);
  this.$apply_button.click(function(event) {that.pull_triggers(that.TRIGGER_EVENTS.APPLY_CLICKED, null);});
  
  
  
  $(".T_tool.T_shape.T_marker", this.$dashboard).click(
    function(event) 
    {
      that.create_marker(
        that.real_world_descriptor_being_drawn,
        that.autoguid_being_drawn,
        that.gis_style_being_drawn);
    });
  
  $(".T_tool.T_shape.T_rectangle", this.$dashboard).click(
    function(event) 
    {
      that.create_rectangle(
        that.real_world_descriptor_being_drawn,
        that.autoguid_being_drawn,
        that.gis_style_being_drawn);
    });
  
  $(".T_tool.T_shape.T_circle", this.$dashboard).click(
    function(event) 
    {
      that.create_circle(
        that.real_world_descriptor_being_drawn,
        that.autoguid_being_drawn,
        that.gis_style_being_drawn);
    });
  
  $(".T_tool.T_shape.T_polyline", this.$dashboard).click(
    function(event) 
    {
      that.create_polyline(
        that.real_world_descriptor_being_drawn,
        that.autoguid_being_drawn,
        that.gis_style_being_drawn);
    });
  
  $(".T_tool.T_shape.T_polygon", this.$dashboard).click(
    function(event) 
    {
      that.create_polygon(
        that.real_world_descriptor_being_drawn,
        that.autoguid_being_drawn,
        that.gis_style_being_drawn);
    });

  
  this.attach_trigger(DTACK__GMAP__GIS__TRIGGER_EVENTS__EDITING_NOTHING, 
    function(trigger_object) 
    {
  	  that.indicate_editing(DTACK__GMAP__GIS__TRIGGER_EVENTS__EDITING_NOTHING);
    });
  
  this.attach_trigger(DTACK__GMAP__GIS__TRIGGER_EVENTS__EDITING_MARKER, 
    function(trigger_object) 
    {
  	  that.indicate_editing(DTACK__GMAP__GIS__TRIGGER_EVENTS__EDITING_MARKER);
    });
  
  this.attach_trigger(DTACK__GMAP__GIS__TRIGGER_EVENTS__EDITING_RECTANGLE, 
    function(trigger_object) 
    {
  	  that.indicate_editing(DTACK__GMAP__GIS__TRIGGER_EVENTS__EDITING_RECTANGLE);
    });
  
  this.attach_trigger(DTACK__GMAP__GIS__TRIGGER_EVENTS__EDITING_CIRCLE, 
    function(trigger_object) 
    {
  	  that.indicate_editing(DTACK__GMAP__GIS__TRIGGER_EVENTS__EDITING_CIRCLE);
    });
  
  this.attach_trigger(DTACK__GMAP__GIS__TRIGGER_EVENTS__EDITING_POLYLINE, 
    function(trigger_object) 
    {
  	  that.indicate_editing(DTACK__GMAP__GIS__TRIGGER_EVENTS__EDITING_POLYLINE);
    });
  
  this.attach_trigger(DTACK__GMAP__GIS__TRIGGER_EVENTS__EDITING_POLYGON, 
    function(trigger_object) 
    {
  	  that.indicate_editing(DTACK__GMAP__GIS__TRIGGER_EVENTS__EDITING_POLYGON);
    });
   
                                        // make a reusable instance of the drawing manager
  this.drawing_manager = new google.maps.drawing.DrawingManager(
    {
                                        // it should not show its little control menu bar
      drawingControl: false
    }
  );
  
  this.activate_marker(options);
  
  this.activate_rectangle(options);

  this.activate_circle(options);

  this.activate_polyline(options);

  this.activate_polygon(options);

} // end method


// --------------------------------------------------------------------------------
// establish the object we are currently editing

dtack__gmap__editor_c.prototype.indicate_editing = function(what)
{
  var F = "indicate_editing";
  
  this.debug_verbose(F, "indicating editing " + what);
  
//.dtack_gmap.T_edit .T_dashboard .T_tool.T_shape .T_current  

  $(".T_tool.T_shape", this.$dashboard).removeClass("T_current"); 

  switch(what)
  {
  	case DTACK__GMAP__GIS__TRIGGER_EVENTS__EDITING_MARKER: 
  	  $(".T_tool.T_shape.T_marker", this.$dashboard).addClass("T_current"); 
  	break;
  	case DTACK__GMAP__GIS__TRIGGER_EVENTS__EDITING_RECTANGLE: 
  	  $(".T_tool.T_shape.T_rectangle", this.$dashboard).addClass("T_current"); 
  	break;
  	case DTACK__GMAP__GIS__TRIGGER_EVENTS__EDITING_CIRCLE: 
  	  $(".T_tool.T_shape.T_circle", this.$dashboard).addClass("T_current"); 
  	break;
  	case DTACK__GMAP__GIS__TRIGGER_EVENTS__EDITING_POLYLINE: 
  	  $(".T_tool.T_shape.T_polyline", this.$dashboard).addClass("T_current"); 
  	break;
  	case DTACK__GMAP__GIS__TRIGGER_EVENTS__EDITING_POLYGON: 
  	  $(".T_tool.T_shape.T_polygon", this.$dashboard).addClass("T_current"); 
  	break;
  }

} // end method

                                                

// --------------------------------------------------------------------------------
// establish the object we are currently editing

dtack__gmap__editor_c.prototype.poke_google_object_under_edit = function(google_object_under_edit, primitive_type)
{
  var F = "poke_google_object_under_edit";
                                   
  if (this.google_object_under_edit)
  {
  	this.google_object_under_edit.setMap(null);
  }
  
  this.google_object_under_edit = google_object_under_edit;
  
  if (this.google_object_under_edit)
    this.google_object_under_edit.set(this.KEYWORDS.PRIMITIVE_TYPE, primitive_type);
  
} // end method



// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.handle_remove_button_clicked = function(event)
{
  var F = "handle_remove_button_clicked";

  if (this.google_object_under_edit !== null)
    this.google_object_under_edit.setMap(null);
    
  switch(this.google_object_under_edit.get(this.KEYWORDS.PRIMITIVE_TYPE))
  {
  	case DTACK__GMAP__GIS_FEATURE_TYPE__POINT: this.delete_marker(this.google_object_under_edit); break;
  	case DTACK__GMAP__GIS_FEATURE_TYPE__RECTANGLE: this.delete_rectangle(this.google_object_under_edit); break;
  	case DTACK__GMAP__GIS_FEATURE_TYPE__CIRCLE: this.delete_circle(this.google_object_under_edit); break;
  	case DTACK__GMAP__GIS_FEATURE_TYPE__POLYLINE: this.delete_polyline(this.google_object_under_edit); break;
  	case DTACK__GMAP__GIS_FEATURE_TYPE__POLYGON: this.delete_polygon(this.google_object_under_edit); break;
  }
    
  this.google_object_under_edit = null;
  
} // end method



// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.deactivate_primitive = function(primitive)
{
  var F = "handle_remove_button_clicked";

  if (!primitive)
    return;
    
  switch(primitive.get(this.KEYWORDS.PRIMITIVE_TYPE))
  {
  	case DTACK__GMAP__GIS_FEATURE_TYPE__POINT: this.deactivate_marker(primitive); break;
  	case DTACK__GMAP__GIS_FEATURE_TYPE__RECTANGLE: this.deactivate_rectangle(primitive); break;
  	case DTACK__GMAP__GIS_FEATURE_TYPE__CIRCLE: this.deactivate_circle(primitive); break;
  	case DTACK__GMAP__GIS_FEATURE_TYPE__POLYLINE: this.deactivate_polyline(primitive); break;
  	case DTACK__GMAP__GIS_FEATURE_TYPE__POLYGON: this.deactivate_polygon(primitive); break;
  }
    
  this.google_object_under_edit = null;
  
} // end method

// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.inform = function(doing, instruction)
{
  var F = "inform";
  
  var google_object_under_edit_curly;
  
  if (this.google_object_under_edit !== null)
  {
  	google_object_under_edit_curly = 
  	  "<span class=\"T_primitive_type\">" +
  	  this.google_object_under_edit.get(this.KEYWORDS.PRIMITIVE_TYPE) +
  	  "</span>";
  	google_object_under_edit_curly += 
  	  " for <span class=\"T_real_world_descriptor\">" +
  	   this.google_object_under_edit.get(this.KEYWORDS.REAL_WORLD_DESCRIPTOR) +
  	   "</span>";
  }
  else
  {
  	google_object_under_edit_curly = 
  	  "<span class=\"T_primitive_type\">" +
  	  this.drawing_manager.getDrawingMode() +
  	  "</span>";
  	google_object_under_edit_curly += 
  	  " for <span class=\"T_real_world_descriptor\">" + 
  	  this.real_world_descriptor_being_drawn + 
  	  "</span>";
  }

  if (google_object_under_edit_curly)
    doing = doing.replace(/google_object_under_edit/, google_object_under_edit_curly);
    
  if (instruction)
  {
  	doing += " <span class=\"T_instruction\">" + instruction + "</span>";
  }
  
  if (this.$doing_div.length == 0)
  {
  	this.debug(F, doing);
  }
  else
  {
    this.$doing_div.html(doing);
  }
  
} // end method

// --------------------------------------------------------------------------------
dtack__gmap__editor_c.prototype.poke_feature_information = function(real_world_descriptor, autoguid, gis_style)
{
  var F = "poke_feature_information";
  
                                        // remember the information of the thing we are drawing
  this.real_world_descriptor_being_drawn = real_world_descriptor;
  this.autoguid_being_drawn = autoguid;
  this.gis_style_being_drawn = gis_style;
  
  this.inform("Nothing exists yet.", "Please choose one of the shape icons.");
                                                                                                                              
                                        // let the button manager know the mode we are going in          
  this.pull_triggers(DTACK__GMAP__GIS__TRIGGER_EVENTS__EDITING_NOTHING, null);

} // end method


// -------------------------------------------------------------------------------

dtack__gmap__editor_c.prototype.debug_verbose = function(F, message)
{
  //this.debug(F, message);
} // end method

