// --------------------------------------------------------------------

										// inherit the base methods and variables
dtack__gmap__tied_balloons_c.prototype = new dtack__gmap__base_c();

                                        // provide an explicit name for the base class
dtack__gmap__tied_balloons_c.prototype.base = dtack__gmap__base_c.prototype;

										// override the constructor
dtack__gmap__tied_balloons_c.prototype.constructor = dtack__gmap__tied_balloons_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__gmap__tied_balloons_c(dtack_environment, table_selector, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__gmap__tied_balloons_c";

										/* call the base class constructor helper */
	dtack__gmap__tied_balloons_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  table_selector,
	  classname != undefined? classname: F);
  }
  
  this.markers = new Object();
  
} // end constructor


// -------------------------------------------------------------------------------

dtack__gmap__tied_balloons_c.prototype.activate = function(participants, options)
{
  var F = "activate";
  
  var that = this;
                                        // let the base class activate
  dtack__gmap__tied_balloons_c.prototype.base.activate.call(this, participants, options);

                                        // locate the rows in the input table
  var $rows = $(this.input_selector + " > TBODY > TR");

                                        // render each tied row
  $rows.each(
    function(index, element)
    {
      that.render_tied_row_on_map($(this));
      
                                        // attach change events to the row's input fields
      that.bind_row_input_events($(this));
    }
  );

} // end method

// -------------------------------------------------------------------------------

dtack__gmap__tied_balloons_c.prototype.bind_row_input_events = function($row)
{
  var F = "bind_row_input_events";
  
  var that = this;
  
  var $icon_input = $(".dtack_gmap_icon", $row);
  
  var $inputs = $icon_input;
  
  $inputs.change(
    function(jqeo)
    {
      that.render_tied_row_on_map($(this).closest("TR"));
	}
  );

} // end method

// -------------------------------------------------------------------------------

dtack__gmap__tied_balloons_c.prototype.render_tied_row_on_map = function($row)
{
  var F = "render_tied_row_on_map";

  var that = this;
  
                                        // reference the latlng input box on this row
  var $latlng_textbox = $("INPUT.dtack_gmap_latlng", $row);

  if ($latlng_textbox.length > 0)
  {
  	                                    // parse the name of the input box to identify the row
    var parts = global_page_object.extract_id_and_field_parts($latlng_textbox.attr("name"))
  
                                        // reference the marker for this row
    var marker = this.markers[parts.autoid];
  
                                        // no marker yet for this row?
    if (marker === undefined)
    {
  	                                    // make a new marker on the map
      marker = new google.maps.Marker();
      this.markers[parts.autoid] = marker;
    }
                                        // already have a marker for this row?
    else
    {
      marker.setVisible(true);
    }
                                        // get the actual geo position of the marker out of the text box
    var latlng = this.unserialize_latlng($latlng_textbox.val());
    
    if (latlng !== null)
    {
      marker.setPosition(latlng);
      marker.setMap(this.map);
	}
    else
    {
      marker.setMap(null);
	}
                                        // reference the icon select box on the row
    var $icon_input = $(".dtack_gmap_icon", $row);
    
    if ($icon_input.length > 0)
    {
      var icon_name = $icon_input.val();
      if (icon_name)
      {
      	var url = this.host_require("dtack_gmap.icons_url_path") + "/" + icon_name + ".png";
      	this.debug(F, "setting marker icon \"" + url + "\"");
      	marker.setIcon(url);
	  }
	}
	else
	{
	  this.debug(F, "no dtack_gmap_icon on row " + parts.autoid);
	}
	
  }
                                        // attach an event to the "remove" icon on this row   
                                        // this is in addition to the tied_records fulfillment handling which actually deletes the record           
  $(".remove_row", $row).click(
    function(jqeo)
    {
      var $row = $(this).closest("TR");
      var $latlng_textbox = $("INPUT.dtack_gmap_latlng", $row);
      var parts = global_page_object.extract_id_and_field_parts($latlng_textbox.attr("name"))
      var marker = that.markers[parts.autoid];
      if (marker !== undefined)
      {
        marker.setMap(null);
        that.markers[parts.autoid] = undefined;
	  }
	}
  );

} // end method

// -------------------------------------------------------------------------------


dtack__gmap__tied_balloons_c.prototype.clicked = function(event)
{
  var F = "dtack__gmap__tied_balloons_c::clicked";
                                        // let the base class get the click
  dtack__gmap__tied_balloons_c.prototype.base.clicked.call(this, event);
  
  var that = this;
  
  var options = new Object();
  
  options.initial_fields = new Object();

                                        // make a text field of where they clicked on the map
  var latlng =  
    this.serialize_latlng2(    
      event.latLng.lat(),
      event.latLng.lng());
      
                                        // stuff the text field into the record we will create using ajax
  options.initial_fields.latlng = latlng;
  options.initial_fields.modified_on = this.format_date(new Date());

                                        // WE NEED A WAY TO KNOW WHAT TABLE WE ARE INSERTING INTO!!!
  var tableschema_name = "application_addresses";
  
                                        // reference the page's particular tied_records for the table we are working with
  var tied_records = global_page_object.tied_records_collection[tableschema_name];  
  
                                        // we need to know when the ajax conversation is finished 
                                        // and the input fields have the autoid in their names
  tied_records.attach_trigger("inserted_record", function(tied_record) {that.inserted_record(tied_record);});
  
                                        // ask the page object to create a new tied record
  var $row = global_page_object.create_tied_record(tableschema_name, options);
  
                                        // reference the latlng input within the new tied record row
  $latlng_textbox = $("INPUT.dtack_gmap_latlng", $row);
  
                                        // stuff current mouse position in there
  $latlng_textbox.val(latlng);
  
} // end method

// -------------------------------------------------------------------------------
// this gets called after the ajax insert_record is done 
// and we have the real autoid saved into the input field names

dtack__gmap__tied_balloons_c.prototype.inserted_record = function(tied_record)
{
  var F = "inserted_record";
                                                 
  this.render_tied_row_on_map(tied_record.$row);

                                        // attach change events to the row's input fields
  this.bind_row_input_events(tied_record.$row);
    
} // end method

// -------------------------------------------------------------------------------

dtack__gmap__tied_balloons_c.prototype.update_textarea = function(value)
{
  var F = "update_textarea";
    
  this.debug(F, "update_textarea for " + this.field_name);
    
  this.$textarea.val(value);
    
  this.$textarea.trigger("change");
    
} // end method
// -------------------------------------------------------------------------------


dtack__gmap__tied_balloons_c.prototype.attach = function()
{
                                        // let the base class attach
  dtack__gmap__tied_balloons_c.prototype.base.attach.call(this);
  
} // end method

// -------------------------------------------------------------------------------

dtack__gmap__tied_balloons_c.prototype.detach = function()
{
                                        // let the base class detach
  dtack__gmap__tied_balloons_c.prototype.base.detach.call(this);

  this.is_attached = false;
} // end method
