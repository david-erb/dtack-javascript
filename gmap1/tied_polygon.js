// --------------------------------------------------------------------

										// inherit the base methods and variables
dtack__gmap__tied_polygon_c.prototype = new dtack__gmap__base_c();

                                        // provide an explicit name for the base class
dtack__gmap__tied_polygon_c.prototype.base = dtack__gmap__base_c.prototype;

										// override the constructor
dtack__gmap__tied_polygon_c.prototype.constructor = dtack__gmap__tied_polygon_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__gmap__tied_polygon_c(dtack_environment, table_selector, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__gmap__tied_polygon_c";

										/* call the base class constructor helper */
	dtack__gmap__tied_polygon_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  table_selector,
	  classname != undefined? classname: F);
  }
  
  this.tableschema_name = table_selector.substring(1) + "_vertices";
  this.vertices = new Object();
  
  this.polything = null;
  this.type = "polyline";
  
} // end constructor


// -------------------------------------------------------------------------------

dtack__gmap__tied_polygon_c.prototype.activate = function(participants, options)
{
  var F = "activate";
  
  var that = this;
                                        // let the base class activate
  dtack__gmap__tied_polygon_c.prototype.base.activate.call(this, participants, options);
  
  this.poly_options =
    {
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      editable: true
    };
  
  this.rows_selector = this.input_selector + " TABLE.T_vertices > TBODY > TR";
  
                                        // locate the rows in the input table
  var $rows = $(this.rows_selector);
  
  this.$type_input = $(this.input_selector + " .T_type SELECT");
  this.$color_input = $(this.input_selector + " .T_color SELECT");
  
  this.$inputs = this.$type_input.add(this.$color_input);
  
  this.$inputs.click(
    function(jqeo)
    {
      that.refresh();
	}
  );
  
                                        // render each tied row
  $rows.each(
    function(index, element)
    {
      that.render_tied_row($(this, false));
    }
  );
                                        // refresh map display from current inputs state
  this.refresh();

} // end method

// -------------------------------------------------------------------------------

dtack__gmap__tied_polygon_c.prototype.render_tied_row = function($row, should_refresh)
{
  var F = "render_tied_row";

  var that = this;
  
                                        // reference the latlng input box on this row
  $latlng_textbox = $("INPUT.dtack_gmap_latlng", $row);

  if ($latlng_textbox.length > 0)
  {
  	                                    // parse the name of the input box to identify the row
    var parts = global_page_object.extract_id_and_field_parts($latlng_textbox.attr("name"))
  
                                        // get the actual geo position of the vertex out of the text box
    var latlng = this.unserialize_latlng($latlng_textbox.val());
    
    if (latlng !== null)
    {
      this.vertices[parts.autoid] = latlng;
	}
  }
                                        // attach an event to the "remove" icon on this row              
  $("A.remove_tied_record", $row).click(
    function(jqeo)
    {
      var F = "remove_tied_record";
      var $row = $(this).closest("TR");
      var $latlng_textbox = $("INPUT.dtack_gmap_latlng", $row);
      var parts = global_page_object.extract_id_and_field_parts($latlng_textbox.attr("name"))   
      that.debug(F, "removing parts.autoid " + parts.autoid);
      that.vertices[parts.autoid] = undefined;
	  that.refresh();
	}
  );
  
  if (should_refresh)
    this.refresh();

} // end method

// -------------------------------------------------------------------------------

dtack__gmap__tied_polygon_c.prototype.create_if_necessary = function()
{
  var F = "dtack__gmap__tied_polygon_c::create_if_necessary";
  
  var should_create = false;
  
  var new_type = this.$type_input.val();
  
  if (this.polything === null)
  {
  	this.debug(F, "must create a \"" + new_type + "\" because not created yet");
    should_create = true;
  }
  else
  if (new_type != this.type)
  {
  	this.debug(F, "must create because new type \"" + new_type + "\"" +
  	  " differs from created type \"" + this.type + "\"");
    should_create = true;
  }
    
  if (!should_create)
  {
    return;
  }
                                        // we already have created the shape?
  if (this.polything !== null)
  {
  	this.polything.setMap(null);
  	this.polything = null;
  }
  
                                        // remember the type we are creating
  this.type = new_type;
  
  if (this.type == "polygon")  
	this.polything = new google.maps.Polygon(this.poly_options);
  else
	this.polything = new google.maps.Polyline(this.poly_options);
                        
  this.polything.setMap(this.map);

  var that = this;
                           
  google.maps.event.addListener(this.polything, "rightclick", 
    function(event)
    {
      if (event.vertex === null)
        that.debug("polygon_rightclick", "right click but no vertex in event");
      else
      {
        that.debug("polygon_rightclick", "deleting index " + event.vertex);
        that.polything.getPath().removeAt(event.vertex);
	  }
	}
  );
  
} // end method

// -------------------------------------------------------------------------------
// refresh map display from current inputs state

dtack__gmap__tied_polygon_c.prototype.refresh = function()
{
  var F = "dtack__gmap__tied_polygon_c::refresh";
  
                                        // create new polygon/polyline object if necessary
  this.create_if_necessary();
  
  var latlng_array = new Array();
  
  for (var autoid in this.vertices)
  {
    if (this.vertices[autoid] !== undefined)
      latlng_array[latlng_array.length] = this.vertices[autoid];
  }
  
  this.debug(F, "latlng_array.length is: " + latlng_array.length);
  
  this.polything.setPath(latlng_array);

  var color = this.$color_input.val();
  
  this.debug(F, "setting color \"" + color + "\"");
  
  this.poly_options.strokeColor = color;
  this.poly_options.fillColor = color;
                                        // for now, set the fill color the same as the edge color, and very low opacity
  this.poly_options.fillOpacity = 0.05;

  this.polything.setOptions(this.poly_options);
      
} // end method

// -------------------------------------------------------------------------------

dtack__gmap__tied_polygon_c.prototype.save = function(options)
{
  var F = "dtack__gmap__tied_polygon_c::post";
  
//  if (!this.is_dirty)
//    return;
  
  var latlngs_path = this.polything.getPath();
  
                                        // locate the rows in the input table
  var $rows = $(this.rows_selector);

  this.debug(F, "saving " + latlngs_path.getLength() + " vertices from " + $rows.length + " table rows")

                                        // start at the first inputs row we already have
  var $row = $rows.first();
                                        // don't submit the model row
  $row = $row.next();
                                        // iterate over the vertices
  for (var i = 0; i < latlngs_path.getLength(); i++) 
  {
  	                                    // no more input rows?
    if ($row.length == 0)
    {
      this.debug(F, "creating new " + this.tableschema_name + " input row for latlng[" + i + "]");
      
                                        // ask the page object to create a new tied record
      $row = global_page_object.create_tied_record(this.tableschema_name);
	}
	
                                        // stuff the value of the latlng into the row's input
    var $latlng_textbox = $("INPUT.dtack_gmap_latlng", $row);
    $latlng_textbox.val(this.serialize_latlng(latlngs_path.getAt(i)));

                                        // use the next input row on the next loop
    $row = $row.next();
  }
  
  var rows_to_delete = new Array();
  while($row.length > 0)
  {
    rows_to_delete[rows_to_delete.length] = $row;
    $row = $row.next();
  }
    
  this.debug(F, "need to remove " + rows_to_delete.length + " rows");
    
  for (var k = rows_to_delete.length-1; k >= 0; k--)
  {
  	var $row = rows_to_delete[k];
  	$row.remove();
  }

} // end method

// -------------------------------------------------------------------------------


dtack__gmap__tied_polygon_c.prototype.clicked = function(event)
{
  var F = "dtack__gmap__tied_polygon_c::clicked";
  
                                        // let the base class get the click
  dtack__gmap__tied_polygon_c.prototype.base.clicked.call(this, event);

                                        // ask the page object to create a new tied record
  var $row = global_page_object.create_tied_record(this.tableschema_name);
  
                                        // reference the latlng input within the new tied record row
  $latlng_textbox = $("INPUT.dtack_gmap_latlng", $row);
  
                                        // stuff current mouse position in there
  $latlng_textbox.val(    
    event.latLng.lat() + ";" +
    event.latLng.lng());
                                                 
  this.render_tied_row($row, true);

} // end method

// -------------------------------------------------------------------------------

dtack__gmap__tied_polygon_c.prototype.attach = function()
{
                                        // let the base class attach
  dtack__gmap__tied_polygon_c.prototype.base.attach.call(this);
  
} // end method

// -------------------------------------------------------------------------------

dtack__gmap__tied_polygon_c.prototype.detach = function()
{
                                        // let the base class detach
  dtack__gmap__tied_polygon_c.prototype.base.detach.call(this);

  this.is_attached = false;
} // end method
