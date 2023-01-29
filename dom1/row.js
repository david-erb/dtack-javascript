// --------------------------------------------------------------------
// class representing a drawing mode

										// inherit the base methods and variables
dtack_dom_row_c.prototype = new dtack_base2_c();

										// override the constructor
dtack_dom_row_c.prototype.constructor = dtack_dom_row_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack_dom_row_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack_dom_row_c";

	this.parent = dtack_base2_c.prototype;

	if (classname == undefined)
	  classname = F;
										/* call the base class constructor helper */
	this.parent.constructor.call(this, dtack_environment, classname);
  }

  var node = null;
}

// -------------------------------------------------------------------------------
dtack_dom_row_c.prototype.initialize = function(node)
{
  var F = "initialize";

  this.node = node;

  this.debug_identifier = "row[" + this.node.rowIndex + "]";

} // end method

// -------------------------------------------------------------------------------

dtack_dom_row_c.prototype.debug_self = function(F)
{

  var inputs = this.node.getElementsByTagName("input");

  this.debug(F,
    indent + "row has " + this.node.cells.length + " cells" +
	" and " + inputs.length + " inputs");

} // end method

// -------------------------------------------------------------------------------

dtack_dom_row_c.prototype.clone = function(after_node)
{
  var F = "clone";

  this.clone_from_model(this.node, this.node.parentNode, after_node);

} // end method

// -------------------------------------------------------------------------------
// watchfrog #88

dtack_dom_row_c.prototype.clone_from_model = function(model_node, tbody_node, after_node)
{
  var F = "clone_from_model";

  this.node = model_node.cloneNode(true);

                                        // allow caller to specify node to insert after
                                        // watchfrog #66
  if (after_node && after_node.nextSibling)
    tbody_node.insertBefore(this.node, after_node.nextSibling);
  else
    tbody_node.appendChild(this.node);

} // end method

// -------------------------------------------------------------------------------

dtack_dom_row_c.prototype.clear_inputs = function(tagname)
{
  var F = "replace_clear_inputs";

  if (tagname == "all")
  {
    this.clear_inputs("input");
	this.clear_inputs("select");
                                        // include textareas in the group of "all"
                                        // watchfrog #131
    this.clear_inputs("textarea");
  }
  else
  {
	var nodes = this.node.getElementsByTagName(tagname);

	this.debug(F, "there are " + nodes.length + " " + tagname + " elements");

	for (var k=0; k<nodes.length; k++)
	{
	  var type = nodes[k].type;

      this.debug(F, nodes[k].name + " type is " + type);

	  if (type == "text" || type == "textarea")
	  {
        //nodes[k].setAttribute("value", "");
                                        // clear input node value using value property
                                        // watchfrog #132
        nodes[k].value = "";
	  }
      else
      if (type == "radio")
      {
                                        // watchfrog #143
        nodes[k].checked = false;
      }
      else
      if (type == "checkbox")
      {
                                        // watchfrog #143
        nodes[k].checked = false;
      }
      else
      if (type == "hidden")
      {
                                        // watchfrog #143
        nodes[k].value = "";
      }
	  else
	  if (type == "select-one")
	  {
        nodes[k].setAttribute("selectedIndex", -1);
		nodes[k].value = "";
	  }
	}
  }

} // end method

// -------------------------------------------------------------------------------

dtack_dom_row_c.prototype.replace_name_patterns = function(tagname, pattern, replacement)
{
  var F = "replace_name_patterns";

  if (tagname == "all")
  {
    this.replace_name_patterns("input", pattern, replacement);
	this.replace_name_patterns("select", pattern, replacement);
                                        // include textareas in the group of "all"
                                        // watchfrog #131
    this.replace_name_patterns("textarea", pattern, replacement);
  }
  else
  {
	var nodes = this.node.getElementsByTagName(tagname);

	this.debug(F, "there are " + nodes.length + " " + tagname + " elements");

	for (var k=0; k<nodes.length; k++)
	{
	  this.replace_name_patterns_in_attribute(nodes[k], "id", pattern, replacement);
	  this.replace_name_patterns_in_attribute(nodes[k], "name", pattern, replacement);
	}
  }

} // end method

// -------------------------------------------------------------------------------

dtack_dom_row_c.prototype.replace_name_patterns_in_attribute = function(node, attribute, pattern, replacement)
{
  var F = "replace_name_patterns_in_attribute";

  if (node[attribute] != undefined && node[attribute] != "")
  {
	var matches = node[attribute].match(pattern);
	if (matches != null)
	{
	  var new_value = node[attribute].replace(pattern, replacement);

	  this.debug(F,
	    node.tagName + " (" + node.type + ") " + attribute +
		" \"" + node[attribute] + "\" replaced by \"" + new_value + "\"");

	  node[attribute] = new_value;
	}
	else
	{
	  this.debug(F,
	    node.tagName + " (" + node.type + ") " + attribute +
		" \"" + node[attribute] + "\" does not match pattern " + pattern);
	}
  }
  else
  {
	this.debug(F, node.tagName + " (" + node.type + ") has no " + attribute);
  }

} // end method
