// --------------------------------------------------------------------
// class representing a toolbox of tools

// wrap the prototyping in case the base class include files failed to arrive
try
{
										// inherit the base methods and variables
  dtack_toolbox_c.prototype = new dtack_base2_c();
										// override the constructor
  dtack_toolbox_c.prototype.constructor = dtack_base2_c;
										/* remember who the base class is */
  dtack_toolbox_c.prototype.parent = dtack_base2_c.prototype;
}
catch(exception)
{
  if (exception.name != undefined)
	window.status = exception.name + ": " + exception.message;
  else
	window.status = exception;
}

// -------------------------------------------------------------------------------
// constructor

function dtack_toolbox_c(page)
{
  var F = "dtack_toolbox_c";

  this.page = page;
										// initilialize the base instance variables
  this.construct(page.dtack_environment, F);
  this.debug_identifier = "toolbox";
										/* the server-supplied javascript object describing the tools in the toolbox  */
  var definition_object = null;
										/* list of mutually exclusive tool buttons */
  this.buttons = new dtack_mutual_buttons_c(this.dtack_environment, dtack_classing_button_c);
  this.buttons.instance_debug_level = 1;

										/* by default, we are not inert */
  var inert = false;

  var that = this;
										/* what gets called when a toolbox button gets clicked */
  this.buttons.attach_trigger("clicked", function(button) {return that.tool_clicked(button);});

	
  this.initially_active_button = null;

}

// -------------------------------------------------------------------------------

dtack_toolbox_c.prototype.tool_clicked = function(button)
{
  var F = "tool_clicked";

  this.activate(button);

} // end method

// -------------------------------------------------------------------------------

dtack_toolbox_c.prototype.activate = function(button)
{
  var F = "activate";
										// the button opaque property is the mode object
  var mode_object = button.opaque;

										/* activate the mode */
  var r = mode_object.activate(
	this.page.currently_active_mode_object);

  if (r.become_current == "yes")
  {
	this.page.currently_active_mode_object = mode_object;
  }

  if (r.stay_down == "no")
  {
	this.debug(F, "tool button does not stay down");
										/* let the button soft-change itself back to state 1 (over) */
										// this is so the button can be clicked again
	button.soft_changed(button.STATE_HOVER);
  }
  else
  {
	this.debug(F, "tool button stays down");

    button.soft_changed(button.STATE_ACTIVE);
  }

} // end method

// -------------------------------------------------------------------------------
// called when this group of tools is opened (i.e. being made visible)

dtack_toolbox_c.prototype.opening = function()
{
  var F = "tool_opening";

  this.debug(F, "opening");

										/* loop through all the buttons in the toolbox */
  for (var i=0; i<this.buttons.list.length; i++)
  {
	var button = this.buttons.list[i];

										// the button opaque property is the mode object
	var drawing_tool = button.opaque;

										/* entire toolbox inert or this button inert? */
	if (this.inert || drawing_tool.definition_object.inert == "1")
	{
	  button.soft_changed(button.STATE_INERT);
	}
	else
	{
	  button.soft_changed(button.STATE_NORMAL);
	}
  }

										/* entire toolbox not inert and we have an initially active button? */
  if (!this.inert && this.initially_active_button != null)
  {
										// the button opaque property is the mode object
	var drawing_tool = this.initially_active_button.opaque;

	this.debug(F, "activating drawing_tool \"" + drawing_tool.definition_object.name + "\"");

	this.activate(this.initially_active_button);
  }

} // end method

// --------------------------------------------------------------------

dtack_toolbox_c.prototype.setup_tool_node = function(container_node, drawing_tool)
{
  var F = "setup_tool_node";

										/* find the anchor link in the new list item */
  var a_node = this.want_first_node_with_tagname(container_node, "a");

  if (a_node)
  {
										/* format what the user sees */
	a_node.innerHTML = "<img src=\"" + drawing_tool.definition_object.tool_url + "\"" +
	  " width=" + drawing_tool.definition_object.tool_xe +
	  " height=" + drawing_tool.definition_object.tool_ye +
	  " class=\"toolbox_tool_img\">";

										/* wrap a button around the container */
										/* the second variable gets stored as "opaque" in the button object */
	var button = this.buttons.add(a_node, drawing_tool);

    button.debug_identifier = drawing_tool.debug_identifier;

										/* if toolbox is inert, make button inert too */
	if (this.inert)
	  button.soft_changed(button.STATE_INERT);

	if (drawing_tool.definition_object.name == 
	    this.definition_object.initially_active_drawing_tool_name)
	{
	  if (this.initially_active_button == null)
	  {
										/* make this mode the current one */
		this.initially_active_button = button;

		this.debug(F, "will activate drawing_tool \"" + drawing_tool.definition_object.name + "\"");
	  }
	  else
	  {
		this.debug(F, "not will activate drawing_tool \"" + drawing_tool.definition_object.name + "\" because one is already active");
	  }
	}
	else
	{
	  this.debug(F, "not will activate drawing_tool \"" + drawing_tool.definition_object.name + "\"" +
	    " because it is not initially_active_drawing_tool_name \"" + this.definition_object.initially_active_drawing_tool_name + "\"");
	}

  }

										/* find the span in the new list item */
  var span_node = this.want_first_node_with_tagname(container_node, "span");

  if (span_node)
  {
										/* format what the user sees */
	span_node.innerHTML = drawing_tool.definition_object.label;
  }
} // end method

// --------------------------------------------------------------------

dtack_toolbox_c.prototype.populate_tool_node = function(container_node, drawing_tool)
{
  var F = "populate_tool_node";

										/* find the anchor link in the new list item */
  var link_node = this.want_element(F, drawing_tool.definition_object.name + "_link");

  if (link_node)
  {
										/* format what the user sees */
	link_node.innerHTML = "<img src=\"" + drawing_tool.definition_object.tool_url + "\"" +
	  " width=" + drawing_tool.definition_object.tool_xe +
	  " height=" + drawing_tool.definition_object.tool_ye +
	  " class=\"toolbox_tool_img\"" +
	  " style=\"" +
	  " width:" + drawing_tool.definition_object.tool_xe + "px;" +
	  " height:" + drawing_tool.definition_object.tool_ye + "px;" +
	//"filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + drawing_tool.definition_object.tool_url + "', sizingMethod='scale');" +
      "\"" +
	">";

	this.debug(F, link_node.innerHTML);

										/* wrap a button around the container */
										/* the second variable gets stored as "opaque" in the button object */
	var button = this.buttons.add(link_node, drawing_tool);

    button.debug_identifier = drawing_tool.debug_identifier;

										/* if toolbox is inert, make button inert too */
										// let inidividual tools be initialized as inert
										// watchfrog #14
	if (this.inert || drawing_tool.definition_object.inert == "1")
	  button.soft_changed(button.STATE_INERT);

	if (drawing_tool.definition_object.name == 
	    this.definition_object.initially_active_drawing_tool_name)
	{
	  if (this.initially_active_button == null)
	  {
										/* make this mode the current one */
		this.initially_active_button = button;

		this.debug(F, "will activate drawing_tool \"" + drawing_tool.definition_object.name + "\"");
	  }
	  else
	  {
		this.debug(F, "not will activate drawing_tool \"" + drawing_tool.definition_object.name + "\" because one is already active");
	  }
	}
	else
	{
	  this.debug(F, "not will activate drawing_tool \"" + drawing_tool.definition_object.name + "\"" +
	    " because it is not initially_active_drawing_tool_name \"" + this.definition_object.initially_active_drawing_tool_name + "\"");
	}
  }

										/* find the anchor link in the new list item */
  var label_node = this.element(drawing_tool.definition_object.name + "_label");

  if (label_node)
  {
										/* format what the user sees */
	label_node.innerHTML = drawing_tool.definition_object.label;
  }
} // end method

// --------------------------------------------------------------------

dtack_toolbox_c.prototype.insert_tool_node = function(container_node, drawing_tool)
{
  var F = "insert_tool_node";
  
  if (container_node)
  {
	var clone_node = this.clone_first_node_with_tagname(container_node, "li");
	
	if (clone_node)
	{
										/* set up the image and video link for the tool we just created */
	  this.setup_tool_node(clone_node, drawing_tool);
	}
  }
} // end method

// -------------------------------------------------------------------------------
dtack_toolbox_c.prototype.initialize = function(
  toolbox_element, 
  definition_object,
  drawing_tools)
{
  var F = "initialize";

  if (!toolbox_element)
  {
	this.debug(F, "not populating toolbox #" + definition_object.autoid +
	  " named \"" + definition_object.name + "\"" +
	  " because no element given");
    return;
  }
										/* remember the server-supplied javascript object describing the toolbox  */
  this.definition_object = definition_object;


  this.buttons.debug_identifier = "toolbox for " + this.definition_object.name;

										/* remove child nodes other than the first */
  this.remove_child_nodes(toolbox_element, "li", 0);

										/* every item in the object array is assumed to be a tool */
  for (var k in drawing_tools)
  {

	if (drawing_tools[k].definition_object.toolbox_autoid == this.definition_object.autoid)
	{
	  this.debug(F, "toolbox #" + this.definition_object.autoid + 
	    " accepts drawing_tool[" + k + "] autoid #" + drawing_tools[k].definition_object.autoid);

	  var tool_name = drawing_tools[k].definition_object.name;

	  if (this.want_element(F, tool_name + "_link"))
	  {
		this.debug(F, "populating " + tool_name);
		this.populate_tool_node(toolbox_element, drawing_tools[k]);
	  }
	  else
	  {
		this.debug(F, "inserting " + tool_name);
		this.insert_tool_node(toolbox_element, drawing_tools[k]);
	  }
	}
	else
	{
      this.debug(F, "toolbox #" + this.definition_object.autoid + 
	    " rejects drawing_tool[" + k + "] autoid #" + drawing_tools[k].definition_object.autoid);
	}
  }

  if (definition_object.initially_open == "yes")
  {
										// called when this group of tools is opened (i.e. being made visible)
    this.opening();
  }

} // end method
