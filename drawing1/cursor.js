// --------------------------------------------------------------------
// class representing a drawing cursor

										// inherit the base methods and variables
dtack_drawing_cursor_c.prototype = new dtack_base2_c();

										// override the constructor
dtack_drawing_cursor_c.prototype.constructor = dtack_drawing_cursor_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack_drawing_cursor_c(page, id, classname)
{
  var F = "dtack_drawing_cursor_c";
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {

	this.parent = dtack_base2_c.prototype;
										/* call the base class constructor helper */
	this.parent.constructor.call(
	  this, 
	  page.dtack_environment, 
	  classname != undefined? classname: F);
  }

										/* remember the page who is housing us */
  this.page = page;

  this.debug_identifier = id;

										/* remember the dom element of the cursor */
  this.element = this.want_element(F, id);

  var that = this;

  if (this.element)
  {
	//this.element.onclick = function(event_object) {that.onclick(event_object);}
	
	//this.element.onmouseover = function(event_object) {that.onmouseover(event_object);}
	//this.element.onmouseout = function(event_object) {that.onmouseout(event_object);}
	
	//this.element.onmousedown = function(event_object) {that.onmousedown(event_object);}
	this.element.onmouseup = function(event_object) {return that.onmouseup(event_object);}
  
    this.element.onmousemove = function(event_object) {return that.onmousemove(event_object);}
  }
}

// -------------------------------------------------------------------------------

dtack_drawing_cursor_c.prototype.onclick = function(event_object)
{
  var F = "onclick";

										/* the page has a mode going on? */
  if (this.page.currently_active_mode_object != undefined)
  {
										/* let the mode know that this cursor was clicked */
										/* the mode might be "delete_cursor" for example */
	this.page.currently_active_mode_object.onclick_cursor(event_object, this);
  }

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_cursor_c.prototype.onmouseover = function(event_object)
{
  var F = "onmouseover";

  this.page.canvas.halo_mouseover(this, true);

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_cursor_c.prototype.onmouseout = function(event_object)
{
  var F = "onmouseout";

  this.debug(F, "mouse out of " + this.page.canvas.which_name(this));

  this.page.canvas.halo_mouseout(this, false);

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_cursor_c.prototype.onmousedown = function(event_object)
{
  var F = "onmousedown";
 
  this.page.canvas.halo_mousedown(this, event_object);

  return false;
} // end method

// -------------------------------------------------------------------------------
// mouseup might happen over this cursor but is not specific to it
dtack_drawing_cursor_c.prototype.onmouseup = function(event_object)
{
  var F = "onmouseup";

  this.page.canvas.mouseup(this, event_object);

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_cursor_c.prototype.onmousemove = function(event_object)
{
  var F = "onmousemove";

  this.page.canvas.halo_mousemove(this, event_object);

} // end method
