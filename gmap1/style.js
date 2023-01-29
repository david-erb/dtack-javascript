// --------------------------------------------------------------------

										// inherit the base methods and variables
dtack__gmap__style_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack__gmap__style_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
dtack__gmap__style_c.prototype.constructor = dtack__gmap__style_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__gmap__style_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__gmap__style_c";

										/* call the base class constructor helper */
	dtack__gmap__style_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  classname != undefined? classname: F);
  }
	
  this.KEYWORDS =
    {
      PRIMITIVE_TYPE: "PRIMITIVE_TYPE",
	};
	
  this.autoguid = undefined;
  this.unique_name = undefined;
  this.display_order = "0";
                                        // default values
  this.edge_color = "blue";  
  this.edge_opacity = 1;
  this.edge_thickness = 1;
  this.fill_color = "white";
  this.fill_opacity = 0;
  this.icon = null;
  this.icon_opacity = 1;
  this.cluster_icon = null;
  this.cluster_icon_opacity = 1;
  
  this.dim_opacity_factor = 0.25;
} // end constructor


// -------------------------------------------------------------------------------

dtack__gmap__style_c.prototype.initialize_from_xml = function($gis_style, is_clustered)
{
  var F = "initialize_from_xml";
  
  this.is_clustered = is_clustered;
  
  var v;
  if ((v = this.trim($gis_style.attr("autoguid"))) !== "") this.autoguid = v; 
  if ((v = this.trim($gis_style.children("unique_name").text())) !== "") this.unique_name = v;
  if ((v = this.trim($gis_style.children("display_order").text())) !== "") this.display_order = v;
  
  if ((v = this.trim($gis_style.children("edge_color").text())) !== "") this.edge_color = v;
  if ((v = this.trim($gis_style.children("edge_opacity").text())) !== "") this.edge_opacity = parseFloat(v);
  if ((v = this.trim($gis_style.children("edge_thickness").text())) !== "") this.edge_thickness = v;
  if ((v = this.trim($gis_style.children("fill_color").text())) !== "") this.fill_color = v;
  if ((v = this.trim($gis_style.children("fill_opacity").text())) !== "") this.fill_opacity = parseFloat(v);
  if ((v = this.trim($gis_style.children("icon").text())) !== "") this.icon = v;
  if ((v = this.trim($gis_style.children("icon_opacity").text())) !== "") this.icon_opacity = parseFloat(v);
  if ((v = this.trim($gis_style.children("cluster_icon").text())) !== "") this.cluster_icon = v;
  if ((v = this.trim($gis_style.children("cluster_icon_opacity").text())) !== "") this.cluster_icon_opacity = parseFloat(v);
  
  	                                    // eztask #14904: make mainline tollpoints never clickable or selectable inpulldown
  if ((v = this.trim($gis_style.children("is_clickable").text())) !== "") this.is_clickable = this.is_affirmative_value(v);

} // end method

// --------------------------------------------------------------------------------
dtack__gmap__style_c.prototype.peek_marker_options = function()
{
  var F = "peek_marker_options";
                                                      
  var marker_options = new Object();
  
  marker_options.clickable = this.is_clickable;
  
  if (this.is_clustered)
  {
    marker_options.icon = this.cluster_icon;
    marker_options.opacity = parseFloat(this.cluster_icon_opacity);
  }
  else
  {
    marker_options.icon = this.icon;
    marker_options.opacity = parseFloat(this.icon_opacity);
  }
  
  if (isNaN(marker_options.opacity))
    marker_options.opacity = 1.0;
  
  return marker_options;
  
} // end method


// --------------------------------------------------------------------------------
dtack__gmap__style_c.prototype.peek_dim_marker_options = function()
{
                                                      
  var marker_options = this.peek_marker_options();
  
  if (isNaN(this.dim_opacity_factor))
    marker_options.opacity *= 0.25;
  else
    marker_options.opacity *= this.dim_opacity_factor;
  
  return marker_options;
  
} // end method

// --------------------------------------------------------------------------------
dtack__gmap__style_c.prototype.set_marker_options = function(marker)
{
  marker.set(DTACK__GMAP__KEYWORDS__GIS_STYLE, this);
  this.primitive_type = DTACK__GMAP__GIS_FEATURE_TYPE__POINT;
  marker.setOptions(this.peek_marker_options());
} // end method



// --------------------------------------------------------------------------------
dtack__gmap__style_c.prototype.peek_rectangle_options = function()
{
  return this.peek_vector_options();
} // end method


// --------------------------------------------------------------------------------
dtack__gmap__style_c.prototype.set_rectangle_options = function(rectangle)
{
  rectangle.set(DTACK__GMAP__KEYWORDS__GIS_STYLE, this);
  this.primitive_type = DTACK__GMAP__GIS_FEATURE_TYPE__RECTANGLE;
  rectangle.setOptions(this.peek_vector_options());
} // end method



// --------------------------------------------------------------------------------
dtack__gmap__style_c.prototype.peek_circle_options = function()
{
  return this.peek_vector_options();
} // end method


// --------------------------------------------------------------------------------
dtack__gmap__style_c.prototype.set_circle_options = function(circle)
{
  circle.set(DTACK__GMAP__KEYWORDS__GIS_STYLE, this);
  this.primitive_type = DTACK__GMAP__GIS_FEATURE_TYPE__CIRCLE;
  circle.setOptions(this.peek_vector_options());
} // end method


// --------------------------------------------------------------------------------
dtack__gmap__style_c.prototype.peek_polyline_options = function()
{
  return this.peek_vector_options();
} // end method

// --------------------------------------------------------------------------------
dtack__gmap__style_c.prototype.set_polyline_options = function(polyline)
{
  polyline.set(DTACK__GMAP__KEYWORDS__GIS_STYLE, this);
  this.primitive_type = DTACK__GMAP__GIS_FEATURE_TYPE__POLYLINE;
  polyline.setOptions(this.peek_vector_options());
} // end method


// --------------------------------------------------------------------------------
dtack__gmap__style_c.prototype.peek_polygon_options = function()
{
  return this.peek_vector_options();
} // end method


// --------------------------------------------------------------------------------
dtack__gmap__style_c.prototype.set_polygon_options = function(polygon)
{
  polygon.set(DTACK__GMAP__KEYWORDS__GIS_STYLE, this);
  this.primitive_type = DTACK__GMAP__GIS_FEATURE_TYPE__POLYGON;
  polygon.setOptions(this.peek_vector_options());
} // end method


// --------------------------------------------------------------------------------
dtack__gmap__style_c.prototype.set_primitive_options = function(primitive)
{
  if (this.primitive_type == DTACK__GMAP__GIS_FEATURE_TYPE__RECTANGLE ||
      this.primitive_type == DTACK__GMAP__GIS_FEATURE_TYPE__POLYLINE ||
      this.primitive_type == DTACK__GMAP__GIS_FEATURE_TYPE__POLYGON)
  {
    primitive.setOptions(this.peek_vector_options());
  }
} // end method


// --------------------------------------------------------------------------------
dtack__gmap__style_c.prototype.dim = function(primitive, want_dim)
{
  var F = "dtack__gmap__style_c::dim";
  
  var primitive_type = primitive.get(DTACK__GMAP__GIS_FEATURE_TYPE);
  
      this.debug_verbose(F, "dimming style with feature type " + this.vts(this.primitive_type) +
        " primitive " + this.vts(primitive.dtack__gmap.feature_id) +
        " with feature type " + this.vts(primitive.get(DTACK__GMAP__GIS_FEATURE_TYPE)));

  if (primitive_type == DTACK__GMAP__GIS_FEATURE_TYPE__RECTANGLE ||
      primitive_type == DTACK__GMAP__GIS_FEATURE_TYPE__CIRCLE ||
      primitive_type == DTACK__GMAP__GIS_FEATURE_TYPE__POLYLINE ||
      primitive_type == DTACK__GMAP__GIS_FEATURE_TYPE__POLYGON)
  {                                 
  	if (want_dim)
      primitive.setOptions(this.peek_dim_vector_options());
    else
      primitive.setOptions(this.peek_vector_options());
  }
  else
  if (primitive_type == DTACK__GMAP__GIS_FEATURE_TYPE__POINT)
  {
  	if (want_dim)
      primitive.setOptions(this.peek_dim_marker_options());
    else
      primitive.setOptions(this.peek_marker_options());
  }
} // end method


// --------------------------------------------------------------------------------
dtack__gmap__style_c.prototype.peek_vector_options = function()
{
  var vector_options = new Object();
  
  vector_options.strokeColor = this.edge_color;
  vector_options.strokeOpacity = this.edge_opacity;
  vector_options.strokeWeight = this.edge_thickness;
  vector_options.fillColor = this.fill_color;
  vector_options.fillOpacity = this.fill_opacity;

  return vector_options;
  
} // end method



// --------------------------------------------------------------------------------
dtack__gmap__style_c.prototype.peek_dim_vector_options = function()
{
  var vector_options = new Object();
  
  vector_options.strokeColor = this.edge_color;
  vector_options.strokeOpacity = this.edge_opacity * this.dim_opacity_factor;
  vector_options.strokeWeight = this.edge_thickness;
  vector_options.fillColor = this.fill_color;
  vector_options.fillOpacity = this.fill_opacity * this.dim_opacity_factor;

  return vector_options;
  
} // end method

                                           
