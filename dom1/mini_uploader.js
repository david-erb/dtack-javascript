// --------------------------------------------------------------------
// class representing the page being viewed in the browser

										// inherit the base methods and variables
dtack__dom__mini_uploader_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack__dom__mini_uploader_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
dtack__dom__mini_uploader_c.prototype.constructor = dtack__dom__mini_uploader_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__dom__mini_uploader_c(page_object, $input, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__dom__mini_uploader_c";
	
    this.page_object = page_object;
    this.$input = $input;

										/* call the base class constructor helper */
	dtack__dom__mini_uploader_c.prototype.base.constructor.call(
	  this,
	  page_object.dtack_environment,
	  classname != undefined? classname: F);

    this.debug_identifier = this.$input.attr("name");
    
    this.CONSTANTS = {
      VISIBLE_STATUS:
      {
      	SUCCESS: "success",
      	WARNING: "warning",
      	FAILURE: "failure"
	  }
	}

    this.visible_status = this.CONSTANTS.VISIBLE_STATUS.SUCCESS;
	
  }
  
} // end constructor


// -------------------------------------------------------------------------------
// this can be called in the head, possibly before any dom elements are loaded

dtack__dom__mini_uploader_c.prototype.initialize = function(options)
{
  var F = "dtack__dom__mini_uploader_c::initialize";

} // end function

// -------------------------------------------------------------------------------
dtack__dom__mini_uploader_c.prototype.activate = function(options)
{
  var F = "activate";
  
  if (this.is_affirmative_option(options, "is_output"))
  {
  	this.$container = this.$input;
    this.debug(F, "activating for output on " + this.$container.attr("name") + " " + this.option_keys_text(options));
  	this.activate_buttons(options);
  	return;
  }

  this.debug_verbose(F, "activating for input " + this.option_keys_text(options));
  this.render();
  
  var that = this;
  
  var action = "upload";

                                        // stuff projx ajax needs to service the request
  this.xml = 
    "<request>" +
    "<commands>" +                                                          
    "<command action=\"" + action + "\">" +
    "<dtproperties>" +
    "<" + this.$input.attr("id") + ">" +
    this.compose_dtproperty_as_xml_scalar("validator") +
    this.compose_dtproperty_as_xml_scalar("validator_specification") +
    this.compose_dtproperty_as_xml_scalar("storage_formatter") +
    this.compose_dtproperty_as_xml_scalar("storage_default") +
    "</" + this.$input.attr("id") + ">" +
    "</dtproperties>" +
    "</command>" +
    "</commands>" +
    "</request>";
  
  this.activate_buttons(options);
  
                                        // allow clicking on the status to toggle the details
  $(".T_status", this.$container).click(
    function(event)
    {
      $(".T_details", that.$container).toggle();
	}
  );
  
                                        // update status from a removal request
  this.attach_trigger(
    "removed_upload",
    function(triggered_object)
    {
      that.display_status_text(
        "The file has been removed from the server.", 
        that.CONSTANTS.VISIBLE_STATUS.SUCCESS);
                                        // clear any validation failure that may have been there   
  	  that.poke_validation_failure(null);
	}
  );

  
} // end method

// -------------------------------------------------------------------------------
dtack__dom__mini_uploader_c.prototype.activate_fileupload = function(uploaded_size, options)
{
  var F = "activate_fileupload";
  
  this.assert("uploaded_size not given", uploaded_size !== undefined);
  this.assert("uploaded_size is NaN", !isNaN(uploaded_size));
  
  this.debug(F, "activating fileupload for uploaded_size " + uploaded_size + this.option_keys_text(options));

                                        // clear the response scalars from the data properties
  this.clear_response();
  
  var that = this;
  
  this.$input.fileupload(
    {                                                            
      maxChunkSize: 1000000,

      uploadedBytes: uploaded_size,
      
      url: this.page_object.ajax_issuer.url,
                                        // don't parse the results from ajax
                                        // it comes back as xml, but we parse it manually from the text
      dataType: "text",
                                        // callback when file selected
      add: function(event, data)
      {                                                                
      	that.debug("fileupload", "adding, data.files length is " + data.files.length);
      	that.debug("fileupload", "adding, data.files[0].name is " + data.files[0].name);
      	
      	                                // remember the files list in case we restart
      	that.files = data.files;
      	                                // extra data sent with the multipart form so projx ajax knows what to do
        data.formData= {xml: that.xml};
        
        that.chunk_has_failed = false;
        
                                        // immediately submit to begin uploading
        that.jqXHR = data.submit();
	  },
      always: function(event, data) {that.handle_always(event, data);},
      progress: function(event, data) {that.handle_progress(event, data);},
      done: function(event, data) {that.handle_done(event, data);},
      fail: function(event, data) {that.handle_fail(event, data);},
      chunksend: function(event, data) {return that.handle_chunksend(event, data);},
      chunkdone: function(event, data) {that.handle_chunkdone(event, data);},
      chunkfail: function(event, data) {that.handle_chunkfail(event, data);},
      send: function(event, data) {that.debug("fileupload", "send");},
      submit: function(event, data) {that.handle_submit(event, data);}
	}
  );
  
} // end function
           
// -------------------------------------------------------------------------------
dtack__dom__mini_uploader_c.prototype.activate_buttons = function(options)
{
  var F = "dtack__dom__mini_uploader_c::activate_buttons";
  
  var that = this;

  this.debug_verbose(F, "activating " + $(this.$container).length + " container(s)");

  var $all_buttons = $(".dttoolbar_button", this.$container);
  this.debug_verbose(F, "removing click handler for " + $all_buttons.length + " buttons");
  $all_buttons.off("click");
  
  this.debug_verbose(F, "activating " + $("#dttoolbar_button_select_link", this.$container).length + " select link(s)");
  this.debug_verbose(F, "activating " + $("#dttoolbar_button_select_anchor", this.$container).length + " select anchor(s)");
  this.debug_verbose(F, "activating " + $("#dttoolbar_button_select_link, #dttoolbar_button_select_anchor", this.$container).length + " select link(s)/anchor(s)");
  
  $("#dttoolbar_button_select_link, #dttoolbar_button_select_anchor", this.$container).click(
    function(event)
    {                                      
                                        // clear any validation failure that may have been there   
      that.poke_validation_failure(null);
      that.activate_fileupload(0, options);
      var element = that.element(that.$input.attr("id"));
      element.click()
	}
  );
  
  $("#dttoolbar_button_remove_link, #dttoolbar_button_remove_anchor", this.$container).click(
    function(event)
    {
      that.debug("remove_button", "remove button clicked");
                                        // eztask #13042: add prompt when deleting document
      if (confirm("Really remove this file permanently?"))
      {
        that.remove_upload(true);
	  }
	}
  );
  
  $("#dttoolbar_button_cancel_link, #dttoolbar_button_cancel_anchor", this.$container).click(
    function(event)
    {
      that.debug("cancel_button", "cancel button clicked");
      that.is_cancel_request = true;
      that.jqXHR.abort();
	}
  );
                                                    
  $("#dttoolbar_button_pause_link, #dttoolbar_button_pause_anchor", this.$container).click(
    function(event)
    {
      that.debug("pause_button", "pause button clicked");
      that.is_cancel_request = false;
      that.jqXHR.abort();
	}
  );

  $("#dttoolbar_button_continue_link, #dttoolbar_button_continue_anchor", this.$container).click(
    function(event)
    {
      that.handle_continue_click(event);
	}
  );
  
  $("#dttoolbar_button_download_link, #dttoolbar_button_download_anchor", this.$container).click(
    function(event)
    {
      that.handle_download_click()
	}
  );
  
  $("#dttoolbar_button_display_link, #dttoolbar_button_display_anchor", this.$container).click(
    function(event)
    {
      that.handle_display_click()
	}
  );
  
  $(".T_thumbnail", this.$container).click(
    function(event)
    {
      that.handle_display_click()
	}
  );
  
} // end function
                                  
          
// -------------------------------------------------------------------------------
dtack__dom__mini_uploader_c.prototype.handle_download_click = function(event)
{
  var F = "handle_download_click";
  
  this.fetch("download");

} // end function
                                    
// -------------------------------------------------------------------------------
dtack__dom__mini_uploader_c.prototype.handle_display_click = function(event)
{
  var F = "handle_display_click";
  
  this.fetch("display");

} // end function
                                    
// -------------------------------------------------------------------------------
dtack__dom__mini_uploader_c.prototype.handle_continue_click = function(event)
{
  var F = "handle_continue_click";

  var uploaded_size = parseInt(this.$input.attr("data-dtproperty-uploaded_size"));
  
                                        // first chunk never finished?   
  if (isNaN(uploaded_size))
    uploaded_size = 0;
    
  this.debug(F, "continue_button button clicked, last uploaded_size is " + uploaded_size);
  this.debug(F, "data.files length is " + this.files.length);
  this.debug(F, "data.files[0].name is " + this.files[0].name);
  
  this.activate_fileupload(uploaded_size);
  this.$input.fileupload("add", {files: this.files});
  
  //this.$input.fileupload("add", {files: [this.files[0]]});
  //this.$input.fileupload("add", {fileInput: this.$input});
  //this.jqXHR = this.$input.fileupload("send", {fileInput: this.$input});
  //this.jqXHR = this.$input.change();

} // end function

// -------------------------------------------------------------------------------
dtack__dom__mini_uploader_c.prototype.fetch = function(delivery_type)
{
  var F = "handle_download_click";
  
  this.debug(F, "handling delivery type \"" + delivery_type + "\"");
  
  var name = this.$input.attr("name");
  
                                        // parse the name
  var parts = this.extract_id_and_field_parts(name);
  
                                        // parse of the name failed?
  if (!parts.table_name || 
      !parts.field_name ||
      !parts.autoid)
  {
  	this.debug(F, "can't parse file input control with name \"" + name + "\"");
  	return;
  }                          

  var guts_xml =  
    "<delivery_type>" + delivery_type + "</delivery_type>" +
    "<tableschema_name>" + parts.table_name + "</tableschema_name>" +
    "<fieldschema_name>" + parts.field_name + "</fieldschema_name>" +
    "<autoid>" + parts.autoid + "</autoid>";
  
  var xml = 
    "<request>" +
    "<commands>" +
    "<command action=\"fetch_database_file\">" +
    guts_xml +
    "</command>" +
    "</commands>" +
    "</request>";
  
  this.debug(F, "posting: " + xml);
  
  var post_options = 
    {
      url: this.page_object.ajax_issuer.url + "&xml=" + xml,
      should_inhibit_waitix: "yes"
	};
	
  if (delivery_type == "display")
    post_options.target = "_blank";
  
  this.page_object.post(post_options);

} // end function

// -------------------------------------------------------------------------------
dtack__dom__mini_uploader_c.prototype.handle_always = function(event, data)
{
  var F = "handle_always";
} // end function

// -------------------------------------------------------------------------------
dtack__dom__mini_uploader_c.prototype.handle_submit = function(event, data)
{
  var F = "handle_submit";
                        
  this.display_status_uploading();
} // end function

// -------------------------------------------------------------------------------
dtack__dom__mini_uploader_c.prototype.handle_done = function(event, data)
{
  var F = "handle_done";
                              
  this.debug(F, "done");
                                                   
  if (this.chunk_has_failed)
  {
    this.debug(F, "done, but doing nothing because chunk_has_failed");
    return;
  }

  this.display_status_not_uploading();

  //html += this.format_variable("event", event, 0);
  //html += this.format_variable("data", data, 0);
  
  
                                        // check a text object which is supposed to be xml returned from projx ajax
                                        // for some reason, the fileupload won't give pre-parse ajax, so we have to it here ourself
  var $response = this.page_object.ajax_issuer.check_result_xml_text(null, data.result);

  if ($response !== null)
  {
    //this.display_diagnostics("<xmp>" + data.result + "</xmp>");
                                        // absorb the response scalars into the data properties
                                        // the server is supposed to send the properties even if validation fails
    this.absorb_response($response);
    
    if (this.check_response_validation($response))
    {
      //this.debug(F, "chunk done, good response loaded " + data.loaded + " out of " + data.total);
	}
	else
	{
      this.debug(F, "validation failure");

      this.display_status_not_uploading();

  	  this.display_status_text(
  	    "The upload request failed.",
  	    this.CONSTANTS.VISIBLE_STATUS.FAILURE);
	}
                                           
    this.render();
//  	this.display_status_text(
//  	  "The upload request is complete.",
//  	  this.CONSTANTS.VISIBLE_STATUS.SUCCESS);
               
  }
  else
  {
    this.render();
  	this.display_status_text(
  	  "The upload request failed.",
  	  this.CONSTANTS.VISIBLE_STATUS.FAILURE);
  }
    
} // end function

// -------------------------------------------------------------------------------
dtack__dom__mini_uploader_c.prototype.handle_chunksend = function(event, data)
{
  var F = "handle_chunksend";
    
  if (this.chunk_has_failed)
  {
  	this.debug(F, "returning false for chunksend");
  	return false;
  }
  else
  {
  	return true;
  }
    
} // end function

// -------------------------------------------------------------------------------
dtack__dom__mini_uploader_c.prototype.handle_chunkdone = function(event, data)
{
  var F = "handle_chunkdone";
    
  
                                        // check a text object which is supposed to be xml returned from projx ajax
                                        // for some reason, the fileupload won't give pre-parse ajax, so we have to it here ourself
  var $response = this.page_object.ajax_issuer.check_result_xml_text(null, data.result);
  
  if ($response !== null)
  {
                                        // absorb the response scalars into the data properties
                                        // the server is supposed to send the properties even if validation fails
    this.absorb_response($response);
                                        // check if the server has sent back validation failure
    if (this.check_response_validation($response))
    {
      //this.debug(F, "chunk done, good response loaded " + data.loaded + " out of " + data.total);
	}
	else
	{
      this.debug(F, "chunk done, validation failure");
    
                                        // signal to next chunk send to stop the chunk chain
      this.chunk_has_failed = true;

      this.display_status_not_uploading();

  	  this.display_status_text(
  	    "The upload request failed.",
  	    this.CONSTANTS.VISIBLE_STATUS.FAILURE);
	}
                                        // update the progress bar and other display showing progress
                                        // don't need to do this since progress events will do the same thing
    //this.update_progress(F, data);
    
  }
  else
  {
    this.debug(F, "chunk done, bad response");
    
                                        // signal to next chunk send to stop the chunk chain
    this.chunk_has_failed = true;
                                                                                                                 
    this.$input.attr("data-dtproperty-is_uploaded", "partial");

    this.display_status_not_uploading();

  	this.display_status_text(
  	  "The upload request failed.",
  	  this.CONSTANTS.VISIBLE_STATUS.FAILURE);
  }

    
} // end function

// -------------------------------------------------------------------------------
dtack__dom__mini_uploader_c.prototype.handle_chunkfail = function(event, data)
{
  var F = "handle_chunkfail";
    
  this.debug(F, "chunk fail");
    
} // end function

// -------------------------------------------------------------------------------
dtack__dom__mini_uploader_c.prototype.handle_fail = function(event, data)
{
  var F = "handle_fail";
                     
  if (this.chunk_has_failed)
  {
    this.debug(F, "fail, but doing nothing because chunk_has_failed");
    return;
  }
  
  this.debug(F, "fail");
                           
  this.display_status_not_uploading();

  var html = this.format_line("fail:");
  
  //html += this.format_variable("event", event, 0);
  //html += this.format_variable("data", data, 0);
  
  
  html += this.format_line("jqXHR.status: " + (data.jqXHR? data.jqXHR.status: "no jqXHR"));
  html += this.format_line("textStatus: " + data.textStatus);
  html += this.format_line("errorThrown: " + data.errorThrown);
    
  this.display_diagnostics(html);
  
  var http_code = parseInt(data.jqXHR? data.jqXHR.status: "999", 10);
  
  if (!data.jqXHR)
  {
  	this.ajax_watcher.register_failure(
  	  "failure trying to upload the file:" +
  	  " the data communication object was not instantiated");
  }
  else
  if (isNaN(http_code))
  {
  	this.ajax_watcher.register_failure(
  	  "failure trying to upload the file:" +
  	  " the server responded with an unexpected http code \"" + ajax_object.http_code + "\"");
  }
  else
  if (http_code == 0)
  {
  }
  else
  if (http_code != 200)
  {
    this.page_object.ajax_watcher.register_failure("unexpected http code " + http_code);
  }
                                        
  this.$input.attr("data-dtproperty-is_uploaded", "partial");
                                        
  this.render();
  
  if (data.errorThrown === "abort")
  {
  	if (this.is_cancel_request)
  	{
  	  this.remove_upload();
  	
      this.display_status_text(
  	    "The upload has been canceled.  The partial file has been removed from the server.",
  	    this.CONSTANTS.VISIBLE_STATUS.WARNING);
	}
	else
	{
      this.display_status_text(
  	    "The upload has been paused.  You may choose to continue it.",
  	    this.CONSTANTS.VISIBLE_STATUS.WARNING);
	}
  }
  else
  {
  	this.display_status_text(
  	  "The upload request failed.",
  	  this.CONSTANTS.VISIBLE_STATUS.FAILURE);
  }
                         
} // end function
                                                  
// -------------------------------------------------------------------------------
dtack__dom__mini_uploader_c.prototype.handle_progress = function(event, data)
{
  var F = "handle_progress";
                                        // update the progress bar and other display showing progress
  this.update_progress(F, data);
    
} // end function

// -------------------------------------------------------------------------------
dtack__dom__mini_uploader_c.prototype.update_progress = function(caller, data)
{
  var F = "update_progress";
  
  var progress_percent = parseInt(data.loaded / data.total * 100, 10);
  
  //this.debug(F, caller + " loaded " + data.loaded + " out of " + data.total + " which is " + progress_percent + "%");

                                        // always show some progress, even if 0 percent
  this.$progress_bar.progressbar("option", "value", progress_percent == 0? 1: progress_percent);
  $(".T_progressval", this.$container).text("loaded " + data.loaded + " out of " + data.total + " bytes ... " + progress_percent + "%");
    
} // end function

// -------------------------------------------------------------------------------
// check inside the response for any validation_failure packets
// validation failure can happen when the file mimetype is not acceptable

dtack__dom__mini_uploader_c.prototype.check_response_validation = function($response)
{
  var F = "check_response_validation";

  var validation_failure = "";
                                        // as implemented, all the validation failures pile as direct children of the response root
                                        // this works whenever there is just one file and one validation message
                                        // errors for multiple files uploaded at the same time will be hard to visually separate
                                        // also multiple errors might pile up and get very long
                                        // see this same comment in projx/ajax/command.k          
                                        // watchfrog #215
  var $validation_failures = $response.children("validation_failure");
  
  if ($validation_failures.length > 0)
  {
    $validation_failures.each(
      function()
      {
        if (validation_failure != "")
          validation_failure += "; ";
          
        validation_failure += $(this).children("message").text();
        validation_failure += " (" + $(this).children("details").text() + ")";
	  }
    );
  }
    
  this.poke_validation_failure(validation_failure);
  
  if (validation_failure)
    return false;
  else
    return true;
    
} // end function

// -------------------------------------------------------------------------------
dtack__dom__mini_uploader_c.prototype.format_variable = function(name, variable, indent_count)
{
  var html = "";
  
  if (indent_count > 2)
    return html;
  
  try
  {
    if ((typeof variable) == "object" || 
        (variable instanceof Object))
    {
      html += this.format_line(name + " is a " + typeof variable + " with members:", indent_count);
      html += this.format_members(name, variable, indent_count + 1);
	}
	else
	{
      html += this.format_line(name + " is a " + typeof variable, indent_count);
	}

  }
  catch(exception)
  {
  	var message; 
	if (exception.name != undefined)
	  message = exception.name + ": " + exception.message;
	else
	  message = exception;
	  
    html += this.format_line(name + " is a " + typeof variable + " (" + message + ")", indent_count);
  }
  
  return html;
} // end function

// -------------------------------------------------------------------------------
dtack__dom__mini_uploader_c.prototype.format_members = function(parent_name, variable, indent_count)
{
  var html = "";

  for(var name in variable)
  {
    try
    {      
      html += this.format_variable(parent_name + "." + name, variable[name], indent_count);
    }
    catch(exception)
    {
  	  var message; 
	  if (exception.name != undefined)
	    message = exception.name + ": " + exception.message;
	  else
	    message = exception;
	    
      html += this.format_line(parent_name + "." + name + " (" + message + ")", indent_count);
    }
  }
  
  return html;
} // end function
// -------------------------------------------------------------------------------
dtack__dom__mini_uploader_c.prototype.format_line = function(text, indent_count)
{
  indent_count = parseInt(indent_count);
  if (isNaN(indent_count))
    indent_count = 0;
    
  var indent = "";
  for (var i=0; i<indent_count*4; i++)
    indent += "&nbsp;";
    
  return indent + text + "<br>\n";
} // end function

// ------------------------------------------------------------------------------
// absorb the response scalars into the data properties
dtack__dom__mini_uploader_c.prototype.absorb_response = function($response)
{
  var F = "absorb_response";
    
  this.debug(F, "absorb_response nice_size \"" + $response.children("nice_size").text() + "\"");
  this.debug(F, "absorb_response thumbnail_url \"" + $response.children("thumbnail_url").text() + "\"");

  this.poke_into_dtproperty("is_uploaded", $response.children("is_uploaded").text());
  this.poke_into_dtproperty("uploaded_on", $response.children("uploaded_on").text());
  this.poke_into_dtproperty("uploaded_size", $response.children("uploaded_size").text());
  this.poke_into_dtproperty("nice_size", $response.children("nice_size").text());
  this.poke_into_dtproperty("nice_expected_size", $response.children("nice_expected_size").text());
  this.poke_into_dtproperty("T_status_details", "");
  this.poke_into_dtproperty("source", $response.children("source").text());
  this.poke_into_dtproperty("mimetype", $response.children("mimetype").text());
  this.poke_into_dtproperty("thumbnail_url", $response.children("thumbnail_url").text());
    
} // end function

// ------------------------------------------------------------------------------
// clear the response scalars from the data properties
dtack__dom__mini_uploader_c.prototype.clear_response = function()
{
  var F = "clear_response";

  this.debug(F, "clearing response");

  this.poke_into_dtproperty("is_uploaded", "partial");
  this.poke_into_dtproperty("uploaded_on", "");
  this.poke_into_dtproperty("uploaded_size", "");
  this.poke_into_dtproperty("nice_size", "");
  this.poke_into_dtproperty("nice_expected_size", "");
  this.poke_into_dtproperty("T_status_details", "");
  this.poke_into_dtproperty("source", "");
  this.poke_into_dtproperty("mimetype", "");
    
} // end function

// -------------------------------------------------------------------------------
dtack__dom__mini_uploader_c.prototype.render = function()
{
  var F = "render";
  
  if (!this.$container)
  {
    this.$container = this.$input.closest("DIV");
    
    this.$input.hide();
    
    var $already_stuff = $(".T_validation_failure", this.$container);
    
                                        // there is already stuff in the container?
                                        // this happens when a row is cloned
                                        // watchfrog #222
    if ($already_stuff.length > 0)
	{
      this.$input.attr("data-dtproperty-is_uploaded", "no");
	}
	else
    {
      this.$container.append(
        "<div class=\"T_validation_failure\"></div>\n" +
        "<div class=\"T_status ui-widget ui-widget-content ui-corner-all\">\n" +
          "<div class=\"T_status_text\"></div>\n" +
          "<div class=\"T_status_size\"></div>\n" +
          "<div class=\"T_status_validation_failure\"></div>\n" +
        "</div>\n" +                              
        "<div class=\"T_progress\">\n" +   
          "<div class=\"T_progressbar\"></div>\n" +   
         "<div class=\"T_progressval\"></div>\n" +   
        "</div>\n" +
        "<div class=\"T_details\">\n" +
          "<div class=\"T_is_uploaded\">\n" +
            "<div class=\"T_uploaded_on\"></div>\n" +
            "<div class=\"T_uploaded_size\"></div>\n" +
            "<div class=\"T_nice_size\"></div>\n" +
            "<div class=\"T_total_count\"></div>\n" +
            "<div class=\"T_source\"></div>\n" +
            "<div class=\"T_mimetype\"></div>\n" +
          "</div>\n" +
          "<div class=\"T_is_not_uploaded\">\n" +
            "<div class=\"T_status_details\"></div>\n" +
          "</div>\n" +
          "<div class=\"T_diagnostics\"></div>\n" +
        "</div>\n" +
        "<div class=\"T_thumbnail\"><img /></div>\n" +
        ""
      );
	}
  }
                                        // have not yet initialized the progressbar?
  if (!this.$progress_bar)
  {
    this.$progress_bar = $(".T_progressbar", this.$container).progressbar(
      {
        max: 100,
        value: 0
  	  }
    );
  }
                                        // have already initialized the progressbar?
  else
  {
  	this.$progress_bar.progressbar("option", "value", 0);
  }
  
  var is_uploaded = this.$input.attr("data-dtproperty-is_uploaded");
  
  this.debug_verbose(F, "rendering with is_uploaded \"" + is_uploaded + "\"");

  if (this.is_uploading)
  {
  	$("#dttoolbar_button_select_link", this.$container).button("disable");
  	$("#dttoolbar_button_remove_td", this.$container).hide();
  	$("#dttoolbar_button_cancel_td", this.$container).show();
  	$("#dttoolbar_button_pause_td", this.$container).show();
  	$("#dttoolbar_button_continue_td", this.$container).hide();
  	$("#dttoolbar_button_download_td", this.$container).hide();
  	$("#dttoolbar_button_display_td", this.$container).hide();
  	$(".T_status", this.$container).hide();
  	$(".T_progress", this.$container).show();
  	this.poke_validation_failure("");
  }
  else
  {
  	$("#dttoolbar_button_select_link", this.$container).button("enable");
    if (this.chunk_has_failed ||
        is_uploaded == "partial")
    {
  	  $("#dttoolbar_button_remove_td", this.$container).show();
      $("#dttoolbar_button_download_td", this.$container).hide();
      $("#dttoolbar_button_display_td", this.$container).hide();
  	  $("#dttoolbar_button_continue_td", this.$container).show();
    }
  	else
  	if (is_uploaded == "yes")
  	{
  	  $("#dttoolbar_button_remove_td", this.$container).show();
      $("#dttoolbar_button_download_td", this.$container).show();
      $("#dttoolbar_button_display_td", this.$container).show();
  	  $("#dttoolbar_button_continue_td", this.$container).hide();
	}
    else
    {
  	  $("#dttoolbar_button_remove_td", this.$container).hide();
      $("#dttoolbar_button_download_td", this.$container).hide();
  	  $("#dttoolbar_button_display_td", this.$container).hide();
  	  $("#dttoolbar_button_continue_td", this.$container).hide();
	}
  	$("#dttoolbar_button_cancel_td", this.$container).hide();
  	$("#dttoolbar_button_pause_td", this.$container).hide();
  	$(".T_status", this.$container).show();
  	$(".T_progress", this.$container).hide();
  }
  
  if (is_uploaded == "yes" ||
      is_uploaded == "partial")
  {
    if (is_uploaded == "yes")
    {  
      var source = this.$input.attr("data-dtproperty-source");
      if (source)
        source = "\"" + source + "\"";
      else
        source = "A file";
      var uploaded_on = this.$input.attr("data-dtproperty-uploaded_on");
      if (uploaded_on)
        uploaded_on = " on " + this.format_date(this.parse_standard_or_sql_dateonly(uploaded_on), {format: "american date only"}) + ".";
      else
        uploaded_on = ".";
                                                       
  	  this.display_status_text(
  	    source + " was uploaded" + uploaded_on,
  	    this.CONSTANTS.VISIBLE_STATUS.SUCCESS);
  	    
  	  var nice_size = this.$input.attr("data-dtproperty-nice_size");
  	  if (nice_size)
  	    nice_size = "Size is " + nice_size;
  	    
  	  $(".T_status_size", this.$container).text(nice_size);
  	  
  	                                    // there is a thumbnail specified in the data attributes?
  	                                    // watchfrog #214
  	  var thumbnail_url = this.$input.attr("data-dtproperty-thumbnail_url");
  	  if (thumbnail_url)
  	  {
  	  	                                // point the image src at the thumbnail
  	  	$(".T_thumbnail IMG", this.$container).prop("src", thumbnail_url);
  	  	                                // show the thumbnail
  	  	$(".T_thumbnail", this.$container).show();
	  }
  	                                    // there is no thumbnail specified in the data attributes?
	  else
	  {
  	  	                                // hide the thumbnail
  	  	$(".T_thumbnail", this.$container).hide();
	  }
	}
	else
	{
  	  this.display_status_text(
  	    "A file has been PARTIALLY uploaded.",
  	    this.CONSTANTS.VISIBLE_STATUS.WARNING);
                                         
      var nice_size = this.$input.attr("data-dtproperty-nice_size");
      var nice_expected_size = this.$input.attr("data-dtproperty-nice_expected_size");                                                            
      
      if (nice_size && nice_expected_size)
      {
  	    $(".T_status_size", this.$container).text(
  	      "The server has received about " + 
  	      nice_size +
  	      " out of " +
  	      nice_expected_size +
  	      " bytes.");             
	  }
	  else
      if (nice_size)
      {
  	    $(".T_status_size", this.$container).text(
  	      "The server has received about " + 
  	      nice_size +
  	      " bytes.");             
	  }
	  else
      if (nice_size && nice_expected_size)
      {
  	    $(".T_status_size", this.$container).text(
  	      "The server has received " + 
  	      " no bytes " +
  	      " out of " +
  	      nice_expected_size +
  	      " bytes.");             
	  }
      else
      {
  	    $(".T_status_size", this.$container).text(
  	      "The server has received " + 
  	      " no bytes.");
	  }
	      
	}
  	this.render_from_dtproperty("uploaded_on", "The file was uploaded: ");
  	this.render_from_dtproperty("uploaded_size", "The actual file size is: ");
  	this.render_from_dtproperty("nice_size", "The nice file size is: ");
  	this.render_from_dtproperty("total_count", "The total expected byte count is: ");
  	this.render_from_dtproperty("nice_expected_size", " out of ");
  	this.render_from_dtproperty("source", "The file was uploaded from: ");
  	this.render_from_dtproperty("mimetype", "The file type was detected as: ");
  	
  	$(".T_file_summary").html();

    $(".T_is_uploaded", this.$container).show();
    $(".T_is_not_uploaded", this.$container).hide();
  }
  else
  {
  	this.display_status_text(
  	  "No file has been uploaded.",
  	  this.CONSTANTS.VISIBLE_STATUS.SUCCESS)
  	$(".T_status_size", this.$container).text("");
  	this.render_from_dtproperty("status_details", "Details: ");
    $(".T_is_not_uploaded", this.$container).show();
    $(".T_is_uploaded", this.$container).hide();
  	  	                                // hide the thumbnail
  	$(".T_thumbnail", this.$container).hide();
    
  }
} // end function

// -------------------------------------------------------------------------------
dtack__dom__mini_uploader_c.prototype.poke_validation_failure = function(message, details)
{
  var F = "poke_validation_failure";

  if (message)
  {
    $(".T_validation_failure", this.$container).text(message);
  	$(".T_validation_failure", this.$container).show();
  }
  else
  {
    $(".T_validation_failure", this.$container).text("");
  	$(".T_validation_failure", this.$container).hide();
  }
} // end function

// -------------------------------------------------------------------------------
dtack__dom__mini_uploader_c.prototype.poke_into_dtproperty = function(name, value)
{
  var F = "poke_into_dtproperty";

  if (value === undefined)
    value = "";

  this.$input.attr("data-dtproperty-" + name, value);
} // end function

// -------------------------------------------------------------------------------
dtack__dom__mini_uploader_c.prototype.compose_dtproperty_as_xml_scalar = function(name)
{
  var F = "compose_dtproperty_as_xml_scalar";
  
  var value = this.$input.attr("data-dtproperty-" + name);
  
  var xml = "";
  
  if (value !== undefined)
  {
  	xml += "<" + name + ">" + value + "</" + name + ">";
  }
  
  return xml;
  
} // end method

// -------------------------------------------------------------------------------
dtack__dom__mini_uploader_c.prototype.render_from_dtproperty = function(name, prefix)
{
  var F = "render_from_dtproperty";

  var value = this.$input.attr("data-dtproperty-" + name);

  if (value === undefined)
    value = "";
    
  //$(".T_status_" + name, this.$container).text(value);
  
  if (value !== undefined &&
      value !== "")
  {
    $(".T_" + name, this.$container).text(prefix + value);
    $(".T_" + name, this.$container).show();
  }
  else
  {
    $(".T_" + name, this.$container).text(prefix + "unavailable");
    $(".T_" + name, this.$container).hide();
  }

} // end function
                                     
// -------------------------------------------------------------------------------
dtack__dom__mini_uploader_c.prototype.render_value = function()
{
  var F = "render";
  
  var $container = this.$input.closest("DIV");
  
  $container.append("<div>X</div>");

} // end function

// -------------------------------------------------------------------------------
dtack__dom__mini_uploader_c.prototype.display_diagnostics = function(html)
{
  $(".T_diagnostics", this.$container).html(html);
} // end function

// -------------------------------------------------------------------------------
dtack__dom__mini_uploader_c.prototype.display_status_text = function(text, visible_status)
{
  var F = "display_status_text";
  
  this.debug_verbose(F, "displaying status text: " + text);
  
  $(".T_status_text", this.$container).text(text);
} // end function

// -------------------------------------------------------------------------------
dtack__dom__mini_uploader_c.prototype.display_status_uploading = function()
{
  this.display_status_text(
    "Upload in progress...", 
    this.CONSTANTS.VISIBLE_STATUS.SUCCESS);
  this.is_uploading = true;
  this.render();
} // end function

// -------------------------------------------------------------------------------
dtack__dom__mini_uploader_c.prototype.display_status_not_uploading = function()
{
  this.is_uploading = false;
  this.render();
} // end function


// -------------------------------------------------------------------------------
// start a removal request
// when done, optional status update happens

dtack__dom__mini_uploader_c.prototype.remove_upload = function(should_display_status_when_done)
{
  var F = "remove_upload";
  
  var name = this.$input.attr("name");
  
                                        // parse the name
  var parts = this.extract_id_and_field_parts(name);
  
                                        // parse of the name failed?
  if (!parts.table_name || 
      !parts.field_name ||
      !parts.autoid)
  {
  	this.assert(F, "can't parse file input control with name \"" + name + "\"");
  }
  
  var trigger_string = undefined;
  var trigger_object = undefined;
                                        // caller wants us to trigger a status update when the removal is complete?
  if (should_display_status_when_done)
  {
    trigger_string = "removed_upload";
    trigger_object = this;
    this.display_diagnostics("");
  }

  this.poke_into_dtproperty("is_uploaded", "no");
  this.poke_into_dtproperty("uploaded_on", "");
  this.poke_into_dtproperty("nice_size", "");
  this.poke_into_dtproperty("status_details", "The file has been removed.");
  this.poke_into_dtproperty("source", "");
  this.poke_into_dtproperty("mimetype", "");
  this.poke_into_dtproperty("thumbnail_url", "");
  
  this.render();
  
  this.display_status_text(
    "Removing the file from the server...",
    this.CONSTANTS.VISIBLE_STATUS.SUCCESS);
  
  this.page_object.ajax_issuer.issue_command(
    "remove_upload",
    "<tableschema_name>" + parts.table_name + "</tableschema_name>" +
    "<fieldschema_name>" + parts.field_name + "</fieldschema_name>" +
    "<autoid>" + parts.autoid + "</autoid>",
    trigger_string,
    trigger_object);
    
} // end function

// -------------------------------------------------------------------------------

dtack__dom__mini_uploader_c.prototype.debug_verbose = function(F, message)
{
  //this.debug(F, message);
} // end method

