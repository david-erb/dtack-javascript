
// --------------------------------------------------------------------
// class representing the xman entries grid

										// inherit the base methods and variables
dtack_miniwindow_speechbubble_c.prototype = new dtack_base2_c();
										/* remember who the base class is */
dtack_miniwindow_speechbubble_c.prototype.parent = dtack_base2_c;

// -------------------------------------------------------------------------------
// constructor

function dtack_miniwindow_speechbubble_c(page)
{
  var F = "dtack_miniwindow_speechbubble_c";
										// initilialize the base instance variables
  this.construct(page.dtack_environment, F);

  this.page = page;

  this.absolute_div = null;
  this.absolute_div_size = null;

  this.title_element = null;
  this.accept_element = null;
  this.input_text_element = null;

} // end constructor

// -------------------------------------------------------------------------------
dtack_miniwindow_speechbubble_c.prototype.initialize = function(
  definition_object_or_data)
{
  var F = "initialize";

  this.properties_override_from(definition_object_or_data);

										/* the dom element of the containing div */
  this.absolute_div = dtack_environment.want_element(F, this.absolute_div_id);

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
	
	this.accept_element = this.want_element(F, this.accept_element_id);
	
	this.input_text_element = this.want_element(F, this.input_text_element_id);
	
	var that = this;
	
	this.accept_element.onmouseup = function(event_object) {that.pull_triggers("accept", that);}
	this.input_text_element.onchange = function(event_object) {that.pull_triggers("changed", that);}
  }

} // end method

// -------------------------------------------------------------------------------
dtack_miniwindow_speechbubble_c.prototype.hide = function()
{
  var F = "hide";
										/* we know the div where the html lives? */
  if (this.absolute_div)
  {
	this.absolute_div.style.display = "none";
  }

} // end method


// -------------------------------------------------------------------------------
dtack_miniwindow_speechbubble_c.prototype.show = function(x, y)
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

