
// --------------------------------------------------------------------
// class representing the comreq dialog box

										// inherit the base methods and variables
dtack_miniwindow_comreq_c.prototype = new dtack_base2_c();
										/* remember who the base class is */
dtack_miniwindow_comreq_c.prototype.parent = dtack_base2_c;

// -------------------------------------------------------------------------------
// constructor

function dtack_miniwindow_comreq_c(page)
{
  var F = "dtack_miniwindow_comreq_c";
										// initilialize the base instance variables
  this.construct(page.dtack_environment, F);

  this.page = page;

  this.absolute_div = null;
  this.modal_div = null;
  this.absolute_div_size = null;

  this.title_element = null;
  this.title2_element = null;
  this.created_by_element = null;
  this.accept_element = null;
  this.delete_element = null;
  this.input_text_element = null;
  this.output_text_element = null;
  this.input_type_elements = new Array();

} // end constructor

// -------------------------------------------------------------------------------
dtack_miniwindow_comreq_c.prototype.initialize = function(
  definition_object_or_data)
{
  var F = "initialize";

  this.properties_override_from(definition_object_or_data);

										/* the dom element of the containing div */
  this.absolute_div = dtack_environment.want_element(F, this.absolute_div_id);
  
                                        // watchfrog #153
  if (this.modal_div_id)
    this.modal_div = dtack_environment.want_element(F, this.modal_div_id);

										/* we know the div where the html lives? */
  if (this.absolute_div)
  {
										/* size of the containing div */
	this.absolute_size =  new dtack_drawing_region_c(
	  this.dtack_environment,
	  {
		"xe": parseFloat(this.absolute_div.clientWidth),
		"ye": parseFloat(this.absolute_div.clientHeight),
		"debug_identifier": "absolute div"
	  });
	
	
	this.absolute_size.debug_dimensions(F);
	
	this.title_element = this.want_element(F, this.title_element_id);
	this.title2_element = this.want_element(F, this.title2_element_id);
	this.created_by_element = this.want_element(F, this.created_by_element_id);
	this.accept_element = this.want_element(F, this.accept_element_id);
	this.delete_element = this.want_element(F, this.delete_element_id);
	this.input_text_element = this.want_element(F, this.input_text_element_id);
	this.output_text_element = this.want_element(F, this.output_text_element_id);
	this.get_elements_by_id(this.absolute_div, this.input_type_element_id, this.input_type_elements);

	
	this.debug(F, "got " + this.input_type_elements.length + " elements of id " + this.input_type_element_id);

	var that = this;
	
	this.accept_element.onmouseup = function(event_object) {that.pull_triggers("accept", that);}
	this.delete_element.onmouseup = function(event_object) {that.pull_triggers("delete", that);}
	this.input_text_element.onchange = function(event_object) {that.pull_triggers("changed", that);}
	this.input_text_element.onkeydown = function(event_object) {that.pull_triggers("keydown", that);}
	this.input_text_element.onclick = function(event_object) {that.pull_triggers("lock", that);}
	this.input_text_element.onkeypress = function(event_object) {that.pull_triggers("lock", that);}

    for (var i in this.input_type_elements)
	{
	  var input_type_element = this.input_type_elements[i];

      this.debug(F, "this.input_type_element[" + i + "] is " + input_type_element.tagName);

	  var value = input_type_element.value;
	  input_type_element.onclick = function(event_object) 
	  {
		that.set_title_from_type(undefined); 
		that.pull_triggers("changed", that);
		that.pull_triggers("lock", that);
	  }

	}

  }

} // end method

// -------------------------------------------------------------------------------
dtack_miniwindow_comreq_c.prototype.hide = function()
{
  var F = "hide";
										/* we know the div where the html lives? */
  if (this.absolute_div)
  {
	this.absolute_div.style.display = "none";
  }
  
                                        // watchfrog #153
  this.disable_modal_background();

} // end method


// -------------------------------------------------------------------------------
dtack_miniwindow_comreq_c.prototype.show = function(x, y)
{
  var F = "show";

										/* we know the div where the html lives? */
  if (this.absolute_div)
  {
	x -= this.anchor_position.x;
	y -= this.anchor_position.y;

	this.absolute_div.style.left = x + "px";
	this.absolute_div.style.top = y + "px";
	this.absolute_div.style.display = "block";
  }

} // end method


// -------------------------------------------------------------------------------
dtack_miniwindow_comreq_c.prototype.enable_modal_background = function()
{
  var F = "enable_modal_background";
                                        // the concept of modal background was introduced because people were
                                        // clicking buttons to navigate away from the page immediately after changing the text
                                        // the onchange-initiated ajax to save the text wasn't finishing before the unload was happening
                                        // the unload was cancelling the ajax, preventing the database update also giving an alert
                                        // eztask #12302: PSWMP: user reports error when changing sheets
                                        // watchfrog #153
  if (this.modal_div)
  {
  	if (!this.modal_background_enabled)
  	{
	  this.modal_div.style.display = "block"; 
      document.body.style.overflow = 'hidden';  // firefox, chrome
      document.documentElement.style.overflow = 'hidden'; // firefox, chrome
      document.body.scroll = "no"; // ie only
      this.modal_background_enabled = true;
	}
  }

} // end method

// -------------------------------------------------------------------------------
dtack_miniwindow_comreq_c.prototype.disable_modal_background = function()
{
  var F = "disable_modal_background";
  
                                        // eztask #12302: PSWMP: user reports error when changing sheets
                                        // watchfrog #153
  if (this.modal_div)
  {
  	if (this.modal_background_enabled)
  	{
  	  this.modal_div.style.display = "none"; 
      document.body.style.overflow = 'auto';  // firefox, chrome
      document.documentElement.style.overflow = 'auto'; // firefox, chrome
      document.body.scroll = "yes"; // ie only
      this.modal_background_enabled = false;
	}
  }

} // end method

// -------------------------------------------------------------------------------
dtack_miniwindow_comreq_c.prototype.set_readonly = function(readonly)
{
  var F = "set_readonly";

  if (readonly)
  {
    if (this.title2_element)
  	  this.title2_element.style.display = "none";
    if (this.delete_element)
	  this.delete_element.style.display = "none";
    if (this.input_text_element)
	  this.input_text_element.style.display = "none";
    if (this.output_text_element)
	  this.output_text_element.style.display = "";
  }
  else
  {
    if (this.title2_element)
  	  this.title2_element.style.display = "";
    if (this.delete_element)
	  this.delete_element.style.display = "";
    if (this.input_text_element)
	  this.input_text_element.style.display = "";
    if (this.output_text_element)
	  this.output_text_element.style.display = "none";
  }

} // end method

// -------------------------------------------------------------------------------
// set the dialog title from the radio button state */

dtack_miniwindow_comreq_c.prototype.set_title_from_type = function(type)
{
  var F = "set_title_from_radio";

  var titles = new Array();
  titles["1"] = "Info Request";
  titles["2"] = "Change Required";
  titles["3"] = "Private";


  if (type == undefined)
  {
										/* find which type radio button is checked */
	for (var k in this.input_type_elements)
	{
	  input_type_element = this.input_type_elements[k];
	  if (input_type_element.checked)
	  {
		type = input_type_element.value;
		break;
	  }
	}
  }

  if (titles[type] != undefined)
  {
	//this.debug(F, "setting title[\"" + type + "\"]");
	this.title_element.innerHTML = titles[type];
  }
  else
  {
	//this.debug(F, "unknown type \"" + type + "\"");
	this.title_element.innerHTML = "&nbsp;";
  }
} // end method

