// --------------------------------------------------------------------
// class representing the symbol drawing mode 

										// inherit the base methods and variables
dtack_drawing_mode_delete_edge_c.prototype = new dtack_drawing_mode_base_c();
										// override the constructor
dtack_drawing_mode_delete_edge_c.prototype.constructor = dtack_drawing_mode_delete_edge_c;

// -------------------------------------------------------------------------------
// constructor

function dtack_drawing_mode_delete_edge_c(page)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack_drawing_mode_delete_edge_c";

										// initilialize the base instance variables
	dtack_drawing_mode_base_c.prototype.constructor.call(this, page, F);
	
	this.parent = dtack_drawing_mode_base_c.prototype;
  }
} // end constructor

// -------------------------------------------------------------------------------
dtack_drawing_mode_delete_edge_c.prototype.initialize = function(definition_object)
{
  var F = "initialize";

										/* let the base object initialize common things */
  this.parent.initialize.call(this, definition_object);

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_mode_delete_edge_c.prototype.activate = function(currently_active_mode_object)
{
  var F = "activate";

										/* let the base object activate common things */
  this.parent.activate.call(this);


										/* we DO become the new currently active mode and stay down */
  return {
	"become_current": "yes",
	"stay_down": "yes"
	};

} // end method

// -------------------------------------------------------------------------------
// we are deleting an existing vertex
// this gets called by a vertex when it notices it has been clicked on

dtack_drawing_mode_delete_edge_c.prototype.onclick_vertex = function(event_object, vertex)
{
  var F = "onclick_vertex";
										/* let the base object do common things */
  this.parent.onclick_vertex(this, event_object, vertex);

										/* tell raphael to delete the edge off the canvas */
  this.delete_edge(vertex);
  
										/* notify ajax to delete the edge and its vertices  */
  this.ajax_delete_edge(vertex);

  return this;

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_mode_delete_edge_c.prototype.delete_edge = function(vertex)
{
  var F = "delete_edge";

  this.page.canvas.delete_edge(vertex);

} // end method

// --------------------------------------------------------------------
// use ajax to send the "delete_edge" notification

dtack_drawing_mode_delete_edge_c.prototype.ajax_delete_edge = function(vertex)
{
  var F = "ajax_delete_edge";

  if (this.page.ajax_url != undefined)
  {
	var xml =
	  "<request>" +
	  "<commands>" +
	  "<phpsessionid>" + this.phpsessionid + "</phpsessionid>" +
	  "<command action=\"delete_edge\"" +
	  " uuid=\"" + vertex.edge_uuid + "\"" +
	  "></command>" +
	  "</commands>" +
	  "</request>";

	var ajax = new dtack_ajax_c();

	var url = this.page.ajax_url;

// don't tack on debug=1 to ajax url
// watchfrog #12
	//if (this.dtack_environment.debug_level == 1)
	//  url += "?debug=1";
	  
	this.debug(F, "telling server to delete edge by hitting " + url);
	this.debug(F, xml);

	ajax.post(F, url, xml, this, "ajax_deleted_edge");
  }
  else
  {
	this.debug(F, "not hitting ajax becaue this.page.ajax_url is undefined");
  }
} // end method

// -------------------------------------------------------------------------------

dtack_drawing_mode_delete_edge_c.prototype.ajax_deleted_edge = function(ajax)
{
  var F = "ajax_deleted_edge";

										/* check standard post-ajax stuff for error */
  if (this.ajax_standard_php_callback(ajax))
  {
										/* let the page display acknowledgement of this */
	this.page.acknowledge_user_action(F, "delete edges complete");
  }
  else
  {
										/* let the page display error message */
										// watchfrog #38
	this.page.reject_user_action(F, "unable to delete edges: " + ajax.message);
  }

} // end method
