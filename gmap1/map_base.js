                                                                          
// --------------------------------------------------------------------

                                        // inherit the base methods and variables
dtack_gmap__map_base_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack_gmap__map_base_c.prototype.base = dtack_base2_c.prototype;

                                        // override the constructor
dtack_gmap__map_base_c.prototype.constructor = dtack_gmap__map_base_c;

// -------------------------------------------------------------------------------
// constructor

function dtack_gmap__map_base_c(page_object, map_div_selector, classname)
{
                                            // we are not doing a prototype construction?
  if (arguments.length > 0)
  {
    var F = "dtack_gmap__map_base_c";

                                        // initilialize the base instance variables
    dtack_gmap__map_base_c.prototype.base.constructor.call(
      this,
      page_object.dtack_environment,
      classname != undefined? classname: F);

	this.push_class_hierarchy(F);

    this.page_object = page_object;
    this.map_div_selector = map_div_selector;
    this.debug_identifier = map_div_selector;
    
    this.map_participants = null;
        
    this.loci = new Array();

    this.CONSTANTS = {}
    this.CONSTANTS.EVENTS = {};
    this.CONSTANTS.EVENTS.RECEIVED_LOCI = "received_loci";
    this.CONSTANTS.EVENTS.RECEIVED_COST_ESTIMATE_ITEMS = "RECEIVED_COST_ESTIMATE_ITEMS";
    this.CONSTANTS.EVENTS.RECEIVED_FEATURES_ATTRIBUTES = "handle_received_features_attributes";
    this.CONSTANTS.EVENTS.FINISHED_SUBMIT_ZOOM = "finished_submit_zoom";
    this.CONSTANTS.EVENTS.HANDLED_MAP_VIEW_CHANGED = "HANDLED_MAP_VIEW_CHANGED";
    this.CONSTANTS.EVENTS.HANDLED_RECEIVED_LOCI = "HANDLED_RECEIVED_LOCI";
    this.CONSTANTS.EVENTS.CLICKED_MAP_PRIMITIVE = "CLICKED_MAP_PRIMITIVE";
    this.CONSTANTS.EVENTS.MOUSED_OVER_MAP_PRIMITIVE = "MOUSED_OVER_MAP_PRIMITIVE";
    this.CONSTANTS.EVENTS.MOUSED_OUT_MAP_PRIMITIVE = "MOUSED_OUT_MAP_PRIMITIVE";

    this.CONSTANTS.AJAX_COMMANDS = {};
    this.CONSTANTS.AJAX_COMMANDS.REQUEST_LOCI = "REQUEST_LOCI";
    this.CONSTANTS.AJAX_COMMANDS.REQUEST_COST_ESTIMATE_ITEMS = "request_cost_estimate_items";
    this.CONSTANTS.AJAX_COMMANDS.REQUEST_FEATURES_ATTRIBUTES = "request_features_attributes";
    this.CONSTANTS.AJAX_COMMANDS.SUBMIT_ZOOM = "submit_zoom";

    this.CONSTANTS.OPTIONS = {};

    this.CONSTANTS.FILTERS = {};

    this.CONSTANTS.IDENTIFIERS = {};
    this.CONSTANTS.IDENTIFIERS.CEITEMS_PSEUDO_LOCUS = "ceitems_pseudo_locus";
    
  }                                                  
               
} // end constructor

// -------------------------------------------------------------------------------
// this is called from the body onload or after all the elements are in the DOM

dtack_gmap__map_base_c.prototype.initialize = function(options)
{
  var F = "dtack_gmap__map_base_c::initialize";
  
  //this.debug(F, "initializing");

} // end function

// -------------------------------------------------------------------------------
// this is called from the body onload or after all the elements are in the DOM

dtack_gmap__map_base_c.prototype.activate = function(options)
{
  var F = "dtack_gmap__map_base_c::activate";
                                    
  this.ajax_issuer = this.page_object.command_ajax_issuer;
    
  this.debug_verbose(F, "this.page_object.command_ajax_issuer is " + this.vts(this.page_object.command_ajax_issuer));
  if (!this.ajax_issuer)
    this.ajax_issuer = this.page_object.ajax_issuer;
                             
  var that = this;
  
  this.debug_verbose(F, "activating");

                                        // handle loci coming in
  this.attach_trigger(
    this.CONSTANTS.EVENTS.RECEIVED_LOCI, 
    "handle_received_loci");
                                        // handle feature coming in response to clicking on it
                                        // information appears in the balloon
  this.attach_trigger(
    this.CONSTANTS.EVENTS.RECEIVED_FEATURES_ATTRIBUTES, 
    "handle_received_features_attributes");
  
  var $map = $(this.map_div_selector);
  
  if ($map.length == 0)
    return;
  
                                        // make an object representing the map and participants in it
  this.map_participants = new dtack__gmap__participants_c(this.page_object, $map);

                                        // set the initial desired cluster zoom to be off by default, which is desired for most maps
                                        // eztask #13798: project map is not showing features due to resolution based clustering being on by default
                                        // maps which desire clustering should use undefined (see overall_map.js)
                                        // undefined means determine cluster zoom from current map zoom
  //this.map_participants.poke_cluster_zoom(this.dtack_environment.cgis["cluster_zoom"]);
  this.debug_verbose(F, "AUTOMATIC CLUSTER FROM ZOOM DISABLED BY DEFAULT");
  this.map_participants.poke_cluster_zoom("0");
  
} // end method
                                                                                           

// -------------------------------------------------------------------------------

dtack_gmap__map_base_c.prototype.instantiate_locus = function(locus_autoguid, $checkbox)
{
  var F = "dtack_gmap__map_base_c::instantiate_locus";
  
  if (!this.loci[locus_autoguid])
  {
  	//this.debug(F, "[CLICPRIM] instantiating locus in the map base " + this.vts(locus_autoguid));

    this.loci[locus_autoguid] = new dtack__gmap__locus_c(this.dtack_environment, locus_autoguid);
  
    var that = this;
                                        // handle clicks on any of the locus map primitives
    this.loci[locus_autoguid].attach_trigger(
      dtack__gmap__locus_CONSTANTS.EVENTS.CLICKED_MAP_PRIMITIVE, 
      function(map_primitive) 
      {
        that.handle_clicked_map_primitive(map_primitive);
      });
  
                                        // handle new features arrived
    this.loci[locus_autoguid].attach_trigger(
      dtack__gmap__locus_CONSTANTS.EVENTS.RECEIVED_FEATURES, 
      function(locus) 
      {
        that.handle_received_features(locus);
      });
      
    if ($checkbox)
    {
      this.loci[locus_autoguid].$status = $(".T_status", $checkbox.closest("TR"));
      this.loci[locus_autoguid].request_method = $checkbox.attr("data-locus_request_method");
      this.loci[locus_autoguid].where_key_attributes = $checkbox.attr("data-locus_request_where_key_attributes");
	}
  }
  else
  {
    //this.debug(F, "[CLICPRIM] returning previously instantiated locus in the map base " + this.vts(locus_autoguid));
  }
  
  return this.loci[locus_autoguid];

} // end function

// -------------------------------------------------------------------------------

dtack_gmap__map_base_c.prototype.request_locus = function(map_participants, locus_autoguid, options)
{
  var F = "dtack_gmap__map_base_c::request_locus";
  
  if (this.loci[locus_autoguid].$status)
  {
    this.loci[locus_autoguid].$status.removeClass("T_success");
    this.loci[locus_autoguid].$status.removeClass("T_failure");
    this.loci[locus_autoguid].$status.removeClass("T_requesting");
    
    this.loci[locus_autoguid].$status.prop("title", "requesting data...");
    this.loci[locus_autoguid].$status.addClass("T_requesting");
  }
             
  this.request_locus_in_view(map_participants, locus_autoguid, options); 
  
//  var request_method = this.loci[locus_autoguid].request_method;                            
//  switch(request_method)
//  {
//    case "in_view": 
//      this.request_locus_in_view(map_participants, locus_autoguid); 
//    break;
//    case "cost_estimate_items": 
//      this.request_locus_of_cost_estimate_items(map_participants, locus_autoguid); 
//    break;
//    default: 
//      throw ("invalid locus.request_method " + this.value_to_string(request_method));
//  }

} // end method
     

// -------------------------------------------------------------------------------

dtack_gmap__map_base_c.prototype.compose_resolution_xml = function()
{
  var F = "dtack_gmap__map_base_c::compose_resolution_xml";
                        
  var zoom =  this.map_participants.peek_cluster_zoom();

  var resolution_xml =
    "<api>" + "google_maps" + "</api>" +
    "<projection>wgs84</projection>" +
    "<zoom>" + zoom + "</zoom>" +
    "<div_width>" + $(this.map_participants.peek_map().getDiv()).width() + "</div_width>" +
    "<div_height>" + $(this.map_participants.peek_map().getDiv()).height() + "</div_height>";
  
  return resolution_xml;

} // end method
     

// -------------------------------------------------------------------------------

dtack_gmap__map_base_c.prototype.request_locus_in_view = function(map_participants, locus_autoguid, options)
{
  var F = "dtack_gmap__map_base_c::request_locus_in_view";
                                     
  var project_xml = "";
  if (this.activated_project)  
    project_xml += "<project_autoid>" + this.activated_project.autoid + "</project_autoid>";

                                        // if the html has the project autoguid symbol defined, then include it
                                        // this is newer than the activated_project mechanism above
  var project_autoguid = this.resolve_symbol("project_autoguid", null);
  if (project_autoguid)  
    project_xml += "<project_autoguid>" + project_autoguid + "</project_autoguid>";
    
  var bounding_box_xml;
                                        // there is an activated project with a bounding box?
  if (this.activated_project &&
      this.activated_project.bounding_box &&
      (this.activated_project.bounding_box.x0 || 
       this.activated_project.bounding_box.x1 ))
  {
  	                                    // use the project's bounding box
    bounding_box_xml =     
    "<bounding_box>" +
    "<ul>" + this.activated_project.bounding_box.x0 + "," + this.activated_project.bounding_box.y0 + "</ul>" +
    "<lr>" + this.activated_project.bounding_box.x1 + "," + this.activated_project.bounding_box.y1 + "</lr>" +
    "</bounding_box>";

  }
                                        // there is no activated project?
  else
  {
  	                                    // use the map view bounding box
    bounding_box_xml = map_participants.compose_bounding_box_xml();
  
    if (bounding_box_xml === null)
    {
  	  this.debug(F, "map participants composed no bounding box xml");
      return;
    }
  }
    
  var options_xml = "";
  if (options)
    for(var k in options)
      options_xml += "<" + k + ">" + this.escape_xml(options[k]) + "</" + k + ">";
  if (options_xml != "")
    options_xml = "<options>" + options_xml + "</options>";
      
  this.ajax_issuer.issue_command(
    this.CONSTANTS.AJAX_COMMANDS.REQUEST_LOCI,
    "<identifiers_csv>" + locus_autoguid + "</identifiers_csv>" +
    this.compose_resolution_xml() +
    project_xml +
    bounding_box_xml +
    "<request_method>" + this.loci[locus_autoguid].request_method + "</request_method>" +
    this.loci[locus_autoguid].peek_filter_xml() +
    options_xml,
    this.CONSTANTS.EVENTS.RECEIVED_LOCI,
    this);

} // end method
                                                                                         
// ----------------------------------------------------------------------------
// called with an ajax object that has finished its request
// ajax_object.trigger_object.pull_triggers(ajax_object.trigger_string, response)

dtack_gmap__map_base_c.prototype.handle_received_loci = function($response)
{
  var F = "handle_received_loci";                                                       

  this.assert("response_object is undefined", $response !== undefined);

  this.assert("response_object is " + this.vts($response) + " not jQuery", ($response instanceof jQuery));

  $definition = $response.find("loci");
    
  this.assert("response_object.loci not found", $definition.length > 0);
                                                                     
  //this.debug(F, "found " + $definition.children().length + " loci definition children");

  var that = this;
                                                       
  $definition.children("locus").each(function() {that.redisplay_locus($(this));});
  
} // end method   

// ----------------------------------------------------------------------------

dtack_gmap__map_base_c.prototype.handle_received_features = function(locus)
{
  var F = "locus";
    
  this.debug_verbose(F, "received features for locus " + locus.name);
  
  if (locus.$status)
  {
    locus.$status.removeClass("T_requesting");
    locus.$status.removeClass("T_failure");
    locus.$status.removeClass("T_success");
    
    if (locus.warning_message)
    {
      locus.$status.prop("title", locus.warning_message);
      locus.$status.addClass("T_failure");
    }
    else
    if (locus.details_message)
    {
      locus.$status.prop("title", locus.details_message);
      locus.$status.addClass("T_success");
    }
    else
    {
      locus.$status.prop("title", "");
      locus.$status.addClass("T_success");
    }

    if (locus.is_clustered)
    {
      locus.$status.addClass("T_locus_is_clustered");
      locus.$status.prev().addClass("T_locus_is_clustered");
      locus.$status.prev().removeClass("T_locus_is_not_clustered");
    }
    else
    {
      locus.$status.removeClass("T_locus_is_clustered");
      locus.$status.prev().removeClass("T_locus_is_clustered");
      locus.$status.prev().addClass("T_locus_is_not_clustered");
    }
  }
  
} // end method   
// ----------------------------------------------------------------------------

dtack_gmap__map_base_c.prototype.handle_clicked_map_primitive = function(map_primitive)
{
  var F = "handle_clicked_map_primitive";
  
  this.debug_verbose(F, "handling clicked map primitive in the map base " + this.vts(map_primitive.dtack__gmap.locus.name));
  
  var locus_autoguid_feature_id = map_primitive.dtack__gmap.locus.name + ":" + map_primitive.dtack__gmap.feature_id;

  var project_xml = "";
  if (this.activated_project)  
    project_xml = "<project_autoid>" + this.activated_project.autoid + "</project_autoid>";
                                        // if the html has the project autoguid symbol defined, then include it
                                        // this is newer than the activated_project mechanism above
  var project_autoguid = this.resolve_symbol("project_autoguid", null);
  if (project_autoguid)  
    project_xml += "<project_autoguid>" + project_autoguid + "</project_autoguid>";
    
  
  var passthrough_xml = 
    "<passthrough>" +
    "<clicked_latlng>" + map_primitive.dtack__gmap.clicked_latlng + "</clicked_latlng>" +
    "</passthrough>";
                     
  this.ajax_issuer.issue_command(
    this.CONSTANTS.AJAX_COMMANDS.REQUEST_FEATURES_ATTRIBUTES,
    "<identifiers_csv>" + locus_autoguid_feature_id + "</identifiers_csv>" +
    project_xml +
    passthrough_xml,
    this.CONSTANTS.EVENTS.RECEIVED_FEATURES_ATTRIBUTES,
    this);                                    
  
} // end method   

// ----------------------------------------------------------------------------
// called with an ajax object that has finished its request
// ajax_object.trigger_object.pull_triggers(ajax_object.trigger_string, response)

dtack_gmap__map_base_c.prototype.handle_received_features_attributes = function($response)
{
  var F = "handle_received_features_attributes";

  try
  {  
  this.assert("response_object is undefined", $response !== undefined);

  $definition = $response.find("features_attributes");
    
  this.assert("response_object.features_attributes not found", $definition.length > 0);
                                                                          
  this.debug_verbose(F, "found " + $definition.children().length + " features_attributes definition children");

  var that = this;
  
  var s = ""
  $definition.children("feature").each(
    function() 
    {
      var locus_autoguid_feature_id = $(this).attr("locus_autoguid_feature_id");
      
          if (s != "")
            s += "\n--------------------------\n";
            
      if (locus_autoguid_feature_id)
        s += "locus_autoguid_feature_id: " + locus_autoguid_feature_id;

      var text = "<div class=\"T_balloon\">";
      
      $(this).children("attribute").each(
        function() 
        {
          var css_class = $(this).attr("css_class");
          text += "<div " + (css_class? " class=\"" + css_class + "\"": "") + ">";
          text += "<div class=\"T_label_and_value\">";
          text += "<div class=\"T_label\">";
  	      var $label = $(this).children("label");
  	      if ($label.length > 0)
  	        text += $label.text();
		  else
  	        text += $(this).attr("name") ;    
  	      text += ":</div>";
          text += "<div class=\"T_value\">";
  	      var $value = $(this).children("value");
          text += $value.text();
  	      
								// mm113017 - lop off the extra zeros in the balloon values
                                // this is breaking other things, removed 2018-03-15 
//		  var res = $value.text().split(".");		  
//		  if (res[1] && res[1].length > 3)
//		  {text += res[0];}
//		  else
//		  {text += $value.text();}	  
							
			
  	      text += "</div>";
  	      text += "</div>";
  	      text += "</div>\n";
  	    }
      );
      
      text += "</div>";
      
      s += text;
      
      if (locus_autoguid_feature_id)
      {
      var parts = locus_autoguid_feature_id.split(":");
      var request_method = parts[0];
      var locus_autoguid = parts[1];
      var feature_id = parts[2];
      var locus = that.loci[request_method + ":" + locus_autoguid];
      
      if (parts.length == 3)
      {
        request_method = parts[0];
        locus_autoguid = parts[1];
        feature_id = parts[2];
        locus = that.loci[request_method + ":" + locus_autoguid];
        that.assert("no such locus " + that.vts(request_method + ":" + locus_autoguid), locus);
	  }
	  else
	  {
        locus_autoguid = parts[0];
        feature_id = parts[1];
        locus = that.loci[locus_autoguid];
        that.assert("no such locus " + that.vts(locus_autoguid), locus);
	  }
      var map_primitive = locus.find_map_primitive(feature_id);
      that.assert("no such map_primitive for locus_autoguid_feature_id " + that.vts(locus_autoguid_feature_id), map_primitive);
      that.debug(F, "map_primitive.dtack__gmap.clicked_latlng is " + map_primitive.dtack__gmap.clicked_latlng);
      that.show_balloon(map_primitive, that.unserialize_latlng(map_primitive.dtack__gmap.clicked_latlng), text);
	  }
  	}
  );
  }
  catch(exception)
  {
    var message;
    if (exception.name != undefined)
      message = exception.name + ": " + exception.message;
    else
      message = exception;

    this.debug(F, message);
  }
  //alert(s);
} // end method   

// ----------------------------------------------------------------------------
// called with an ajax object that has finished its request
// ajax_object.trigger_object.pull_triggers(ajax_object.trigger_string, response)

dtack_gmap__map_base_c.prototype.format_features_attributes = function($features_attributes)
{
  var F = "dtack_gmap__map_base_c::format_features_attributes";
  
  var s = ""
  $features_attributes.children("feature").each(
    function() 
    {
      var locus_autoguid_feature_id = $(this).attr("locus_autoguid_feature_id");
      
      var text = "<div class=\"T_balloon\">X";
      
      $(this).children("attribute").each(
        function() 
        {
          var css_class = $(this).attr("css_class");
          text += "<div " + (css_class? " class=\"" + css_class + "\"": "") + ">";
  	      text += $(this).attr("name");
  	      text += ": ";
  	      var $value = $(this).children("value");
  	      text += $value.text();
  	      text += "</div>\n";
  	    }
      );
      
      text += "</div>";
      
      s += text;
  	}
  );
  
  return s;
  
} // end method   
                                                              
// -------------------------------------------------------------------------------
dtack_gmap__map_base_c.prototype.show_balloon = function(map_primitive, latlng, text)
{
  var F = "dtack_gmap__map_base_c::show_balloon";
    
  if (!this.info_window)
    this.info_window = new google.maps.InfoWindow(
      {
      	disableAutoPan: true,
      	maxWidth: 600
	  }
	);

  this.info_window.setContent(text);
  this.info_window.setPosition(latlng);

  this.info_window.open(
    this.map_participants.peek_map());
    

 // this.debug(F, "base show " + this.name);
  
} // end method
                                                     

// ----------------------------------------------------------------------------
// called with an ajax object that has finished its request                 
// can also be called during page activate if the locus definition has been written into the global object
// ajax_object.trigger_object.pull_triggers(ajax_object.trigger_string, response)

dtack_gmap__map_base_c.prototype.redisplay_locus = function($definition)
{
  var F = "redisplay_locus";
  
  var unique_name = $definition.attr("unique_name");
  this.assert("locus definition does not contain the \"unique_name\" attribute", unique_name !== undefined);
  this.assert("locus definition \"unique_name\" attribute is blank", unique_name !== "");
  
  var locus_autoguid = $definition.attr("autoguid");
  this.assert("locus definition does not contain the \"autoguid\" attribute", locus_autoguid !== undefined);
  this.assert("locus definition \"autoguid\" attribute is blank", locus_autoguid !== "");
                        
  this.debug_verbose(F, "locus " + locus_autoguid + " \"" + unique_name + "\" has " + $definition.children().length + " definition children");
  
  var that = this;
  $definition.children("message").each(function() {that.debug(F, "locus message: " + $(this).text());});
  
  var $warnings = $definition.children("warnings");
  var warning_message = "";
  $warnings.children("warning").each(function() {warning_message += $(this).children("message").text();});
  this.loci[locus_autoguid].warning_message = warning_message;

  var $details = $definition.children("details");
  var details_message = "";
  $details.children("detail").each(function() {details_message += $(this).children("message").text();});
  this.loci[locus_autoguid].details_message = details_message;

                                        // wipe the existing locus map primitives off the map and destroy them from memory
                                        // no error if there isn't such a locus
  //this.debug(F, "disposing contents of locus " + locus_autoguid);
  this.loci[locus_autoguid].dispose();
  
                                        // draw and show the map primitives
  this.loci[locus_autoguid].activate(this.map_participants, $definition);
  
                                        // notify listeners of the features
                                        // in particular, checkoxes change their waiting state
  this.loci[locus_autoguid].pull_triggers(
    dtack__gmap__locus_CONSTANTS.EVENTS.RECEIVED_FEATURES, 
    this.loci[locus_autoguid]);
  
} // end method   
                                                                           

// ----------------------------------------------------------------------------
// wipe the existing locus map primitives off the map and destroy them from memory
// no error if there isn't such a locus

dtack_gmap__map_base_c.prototype.dispose_locus = function(locus_autoguid)
{
  var F = "dispose_locus";

  if (this.loci[locus_autoguid] != undefined)
  {  
    this.debug(F, "diposing locus " + locus_autoguid);
  	this.loci[locus_autoguid].dispose();
  	this.loci[locus_autoguid] = undefined;
  }
  
} // end method   
                                                                       
