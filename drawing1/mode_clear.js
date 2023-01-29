// --------------------------------------------------------------------
// class representing the symbol drawing mode 

										// inherit the base methods and variables
dtack_drawing_mode_clear_c.prototype = new dtack_drawing_mode_base_c();
										// override the constructor
dtack_drawing_mode_clear_c.prototype.constructor = dtack_drawing_mode_clear_c;

// -------------------------------------------------------------------------------
// constructor

function dtack_drawing_mode_clear_c(page)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack_drawing_mode_clear_c";

										// initilialize the base instance variables
	dtack_drawing_mode_base_c.prototype.constructor.call(this, page, F);
	
	this.parent = dtack_drawing_mode_base_c.prototype;
  }
} // end constructor

// -------------------------------------------------------------------------------
dtack_drawing_mode_clear_c.prototype.initialize = function(definition_object)
{
  var F = "initialize";

										/* let the base object initialize common things */
  this.parent.initialize.call(this, definition_object);

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_mode_clear_c.prototype.activate = function(currently_active_mode_object)
{
  var F = "activate";

  if (confirm(
	"Do you really want to clear all annotations?\n\n" +
	"The page will be completely empty of all symbols, lines and text."))
  {


										/* tell raphael to clear the canvas */
	this.clear();
  
										/* notify ajax to clear the vertices */
	this.ajax_clear_vertices();

  }
										/* we DO NOT become the new currently active mode nor stay down */
  return {
	"become_current": "no",
	"stay_down": "no"
  };

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_mode_clear_c.prototype.clear = function(x, y)
{
  var F = "clear";

  this.page.canvas.clear_vertices();

} // end method

// --------------------------------------------------------------------
// use ajax to send the "clear_vertices" notification

dtack_drawing_mode_base_c.prototype.ajax_clear_vertices = function(x, y, drawing_tool_autoid)
{
  var F = "ajax_clear_vertices";

  if (this.page.ajax_url != undefined)
  {
	var xml =
	  "<request>" +
	  "<commands>" +
	  "<phpsessionid>" + this.phpsessionid + "</phpsessionid>" +
	  "<command action=\"clear_vertices\"" +
	  "></command>" +
	  "</commands>" +
	  "</request>";

	var ajax = new dtack_ajax_c();

	var url = this.page.ajax_url;

// don't tack on debug=1 to ajax url
// watchfrog #12
	//if (this.dtack_environment.debug_level == 1)
	//  url += "?debug=1";
	  
	this.debug(F, "telling server to clear vertices by hitting " + url);
	this.debug(F, xml);

	ajax.post(F, url, xml, this, "ajax_cleared_vertices");
  }
  else
  {
	this.debug(F, "not hitting ajax becaue this.page.ajax_url is undefined");
  }
} // end method

// -------------------------------------------------------------------------------

dtack_drawing_mode_base_c.prototype.ajax_cleared_vertices = function(ajax)
{
  var F = "ajax_cleared_vertices";

										/* check standard post-ajax stuff for error */
  if (this.ajax_standard_php_callback(ajax))
  {
										/* let the page display acknowledgement of this */
	this.page.acknowledge_user_action(F, "clear vertices complete");
  }
  else
  {
										/* let the page display error message */
										// watchfrog #38
	this.page.reject_user_action(F, "unable to clear vertices: " + ajax.message);
  }

} // end method
