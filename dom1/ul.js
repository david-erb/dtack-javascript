// --------------------------------------------------------------------
// class representing a drawing mode

										// inherit the base methods and variables
dtack_dom_ul_c.prototype = new dtack_base2_c();

										// override the constructor
dtack_dom_ul_c.prototype.constructor = dtack_dom_ul_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack_dom_ul_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack_dom_ul_c";

	this.parent = dtack_base2_c.prototype;

	if (classname == undefined)
	  classname = F;
										/* call the base class constructor helper */
	this.parent.constructor.call(this, dtack_environment, classname);
  }

  this.expand_ul_for_stuff = "yes";
}

// -------------------------------------------------------------------------------
dtack_dom_ul_c.prototype.initialize = function(ul_id)
{
  var F = "initialize";

  var ul_node = this.want_element(F, ul_id);

  this.initialize_from_node(ul_node);

} // end method

// -------------------------------------------------------------------------------
dtack_dom_ul_c.prototype.initialize_from_node = function(ul_node)
{
  var F = "initialize";

  if (ul_node)
  {
	this.ul_node = ul_node;
										/* common name for instance variable */
										/* watchfrog #52 */
	this.grid_node = this.ul_node;

	this.ul_id = this.ul_node.id;

	this.debug_identifier = this.ul_id;

	if (this.ul_node.tagName.toLowerCase() == "ul")
	{
	  //this.debug(F, this.node_description(this.ul_node) + " initialized");
	}
	else
	{
	  this.debug(F, this.node_description(this.ul_node) + " is not a ul");

	  this.ul_node = undefined;
	}
  }
  else
  {
	this.debug(F, "invalid node");
  }

} // end method

// --------------------------------------------------------------------
// discover the li nodes to use for list

dtack_dom_ul_c.prototype.find_lis = function(control)
{
  var F = "find_lis";
										/* remember the find control in case we clone lis */
  this.find_control = control;
										/* clear the old list of lis */
  this.li_array = new Array();

  if (!this.ul_node)
    return;

  var n = this.ul_node.childNodes.length;

  //this.debug(F, this.node_description(this.ul_node) + " has " + n + " children");

										// traverse all the children of the ul node
  for (var k=0; k<n; k++)
  {
	var li_node = this.ul_node.childNodes[k];
	if (li_node.tagName == "LI")
	{

	  //this.debug(F, k + ". " + this.node_description(li_node));
										// discover the cell nodes in the li
	  this.find_li(li_node, this.find_control);
	}
  }

  if (this.instance_debug_level > 0)
    this.debug(F, this.node_description(this.tbody_node) + " has " + this.li_array.length + " LI child nodes");

} // end method

// --------------------------------------------------------------------
// discover the cell nodes in the li

dtack_dom_ul_c.prototype.find_li = function(li_node, control)
{
  var F = "find_li";

  var li_index = this.li_array.length;

										// this is for jquery-ui sortable's needs
  li_node.id = "li_index_" + li_index;

  var that = this;

  var cells = new Array();

  var li_item = {
    "li_index": li_index,
	"li_node": li_node,
	"original_css_classname": li_node.className,
	"normal_css_classname": li_node.className,
	"cells": cells};
										/* keep a reusable array of the li nodes */
  this.li_array[li_index] = li_item;
										/* for every cell of interest */
  for (var k in control.cells)
  {
	var cell_node = this.want_first_node_with_id(li_node, control.cells[k].id);

	if (cell_node)
	{
	  var cell = new Object();
	  cell.id = control.cells[k].id;
	  cell.attribute = control.cells[k].attribute;
      cell.property = control.cells[k].property;
	  cell.node = cell_node;

										/* node gets cell attribute so we can get it during events */
	  cell.node.cell = cell;
										/* every cell refers back to the li item it is on */
	  cell.li_item = li_item;
                                        /* control calls for an onclick to pull a trigger? */
      if (control.cells[k].onclick != undefined)
      {
        cell.node.onclick = function(event_object) {return that.notify(event_object, "clicked");}

        cell.node.style.cursor = "pointer";
      }
                                        /* control calls for an onchange to pull a trigger? */
      if (control.cells[k].onchange != undefined)
      {
        cell.node.onchange = function(event_object) {return that.notify(event_object, "changed");}
      }
										/* control calls for an onmouse to pull a trigger? */
										// watchfrog #31
	  if (control.cells[k].onmouse != undefined)
	  {
		cell.node.onmouseover = function(event_object) {return that.notify(event_object, "mouse_over");}
		cell.node.onmouseout = function(event_object) {return that.notify(event_object, "mouse_out");}
	  }
	}

	cells.push(cell);
  }

} // end method

// --------------------------------------------------------------------
// stuff all items in the list starting at the top of the list
// the the current implementation does not create new items,
// so the list must contain the maximum number which will be desired
// unused list items will be made invisible

dtack_dom_ul_c.prototype.stuff_values = function(data_objects, options)
{
  var F = "stuff_values";
  var value;

  var append_objects = "no";
  if (options != undefined)
  {
	append_objects = options["append_objects"];
  }

										/* start stuffing at the beginning of the list */
  var itemid = 0;
										/* caller specifies to append to the list? */
  if (append_objects == "yes")
    itemid = this.li_array.length;
										/* for every given data_object */
                                        // NOTE!! this pulls objects out in order of their index numerical or lexical value
                                        // not the order in which they came in the object definition string
  for (var k in data_objects)
  {
										/* we have exceeded ul capacity? */
										// watchfrog #26
	if (itemid >= this.li_array.length)
	{

      //this.debug(F, "itemid " + itemid + " exceeds array length " + this.li_array.length + " so cloning");

										/* clone first li and insert it at the end */
	  var li_node = this.clone_li(0);

										/* discover the cell nodes in the li */
	  this.find_li(li_node, this.find_control);

	}
    else
    {
      //this.debug(F, "itemid " + itemid + " does not exceed array length " + this.li_array.length + " so not cloning");
    }
										/* for short */
	var li_item = this.li_array[itemid];

	//this.debug(F, itemid + ". li_item is " + li_item);

										/* list li keeps reference to original data_object */
	li_item.data_object = data_objects[k];

										/* for every cell of interest */
	for (var c in li_item.cells)
	{
										/* reference the cell on this li */
	  var cell = li_item.cells[c];

	  if (cell == undefined)
	  {
        if (this.instance_debug_level > 0)
		  this.debug(F, "no cells[" + c + "]");
	  }
	  else
	  if (cell.node)
	  {
		cell.node.cell = cell;

										/* there is a data attribute associated with this cell? */
										// don't try to stuff a value into a cell defined with no attribute name
										// watchfrog #51
		if (cell.attribute != undefined)
		{
		  var value = data_objects[k][cell.attribute];

		  if (value != undefined)
		  {
			this.stuff_value(cell.node, value, cell.property);
			// cell.node.innerHTML = value;
		  }
		  else
		  {
			// cell.node.innerHTML = "-";
		  }
		}
	  }

	}
										/* show the entire li */
	li_item.li_node.style.display = "block";

	if (data_objects[k].dtack_dom_ul_li_css_class != undefined)
	{
	  li_item.li_node.className = data_objects[k].dtack_dom_ul_li_css_class;
	}
	else
	{
	  li_item.li_node.className = "";
	}

	itemid++;
										/* stop stuffing items when the list is full */
	if (this.expand_ul_for_stuff != "yes" &&
	    itemid == this.li_array.length)
	  break;
  }

										/* for all the remaining lis */
  while (itemid < this.li_array.length)
  {
										/* for short */
	var li_item = this.li_array[itemid];
										/* release the data object */
	li_item.data_object = null;
										/* hide the li_item completely */
	li_item.li_node.style.display = "none";

	itemid++;
  }


} // end method

// -------------------------------------------------------------------------------
// stuff a single value into a node

dtack_dom_ul_c.prototype.stuff_value = function(node, value, property)
{
  var F = "stuff_value";

  var tagname = node.tagName.toUpperCase();

  //this.debug(F, "stuffing " + this.node_description(node));

                                        // allow assigning non-default properties of the dom nodes in the table
                                        // for example property could be "style.display"
                                        // watchfrog #71
  if (property == "name")
  {
    //this.debug(F, "stuffing " + this.node_description(node) + " " + property + " with value \"" + value + "\"");
    node.name = value;
  }
  else
  if (property != undefined)
  {
    if (this.instance_debug_level > 0)
      this.debug(F + "_property", "stuffing " + this.node_description(node) + " " + property + " with value \"" + value + "\"");
    eval("node." + property + " = value;");
  }
  else
  if (tagname == "DIV" ||
      tagname == "SPAN" ||
      tagname == "LEGEND" ||
      tagname == "TD")
  {
    node.innerHTML = value;
  }
  else
  if (tagname == "INPUT" ||
      tagname == "TEXTAREA")
  {
      if (node.type == "checkbox")
      {
      node.checked = value == node.value;
      }
      else
                                        // stuff radio value by searching among the radio group for one that has matching value
                                        // watchfrog #82
      if (node.type == "radio")
      {
        var found = false;
        var count = 0;
        for (var i=0; i<node.form.elements.length; i++)
      {
        if (node.form.elements[i].name == node.name)
        {
                                        // fix problem where radio does not get unchecked if none match value
                                        // watchfrog #95
          if (node.form.elements[i].value == value)
          {
            if (this.instance_debug_level > 0)
              this.debug(F, "found " + this.node_description(node.form.elements[i]) + " with value \"" + value + "\"" +
                " on form " + node.form.name);
            node.form.elements[i].checked = true;
            found = true;
            break;
          }
          else
          {
            //this.debug(F, "unchecking element[" + i + "] " +
            //  this.node_description(node) + " with value \"" + node.form.elements[i].value + "\"" +
            //  " on form " + node.form.name);

            node.form.elements[i].checked = false;

            count++;
          }
        }
      }
      if (!found)
      {
                                        // add count to radio button not found debug line
                                        // watchfrog #96
        if (this.instance_debug_level > 0)
          this.debug(F, "unable to find " + this.node_description(node) + " with value \"" + value + "\"" +
            " from among " + count + " radio buttons" +
            " on form " + node.form.name);
      }
      }
      else
      {
      //this.debug(F, "stuffing " + this.node_description(node) + " with value \"" + value + "\"");
      node.value = value;
    }
  }
  else
  if (tagname == "IMG")
  {
    node.src = value;
  }
  else
  if (tagname == "SELECT")
  {
    for (var index=0; index<node.options.length; index++)
      if (node.options[index].value == value)
        break;
    if (index >= node.options.length)
      index = -1;
    node.selectedIndex = index;

    //this.debug(F, "stuffed " + this.node_description(node) + " value \"" + value + "\" at index " + index);
  }
  else
  {
    if (this.instance_debug_level > 0)
      this.debug(F, "cannot stuff " + this.node_description(node));
  }

} // end method

// -------------------------------------------------------------------------------
// stuff a single value into a node

dtack_dom_ul_c.prototype.stuff_value_old = function(node, value, property)
{
  var F = "stuff_value";

  var tagname = node.tagName.toUpperCase();

  if (this.instance_debug_level > 0)
    this.debug(F, "stuffing " + this.node_description(node) + " with \"" + value + "\"");

  if (tagname == "DIV" ||
      tagname == "SPAN" ||
      tagname == "LEGEND" ||
      tagname == "TD")
  {
	node.innerHTML = value;
  }
  else
  if (tagname == "INPUT" ||
      tagname == "TEXTAREA")
  {
    node.value = value;
  }
  else
  if (tagname == "IMG")
  {
    node.src = value;
  }
  else
  {
    if (this.instance_debug_level > 0)
	  this.debug(F, "cannot stuff " + this.node_description(node));
  }

} // end method

// -------------------------------------------------------------------------------
// returns a dom object or null

dtack_dom_ul_c.prototype.clone_li = function(li_index)
{
  var F = "clone_li";

  var li_node = null;

  if (this.ul_node)
  {
										/* watchfrog #24 */
	if (li_index < this.li_array.length)
	{
	  var li_node = this.li_array[li_index].li_node.cloneNode(true);

	  this.ul_node.appendChild(li_node);

      //this.debug(F, "cloning " + this.node_description(this.li_array[li_index].li_node));
	}
	else
	{
	  this.debug(F,
	    "ul only has " + this.ul_node.childNodes.length + " lis" +
	    " so can't clone li index " + li_index);
	}
  }
  else
  {
	this.debug(F, "ul with id \"" + this.ul_id + "\" was never found");
  }

  return li_node;
} // end method

// -------------------------------------------------------------------------------

dtack_dom_ul_c.prototype.notify = function(event_object, trigger_name)
{
  var F = "notify";

  if (!event_object)
    event_object = window.event;

  var event_node = event_object.target || event_object.srcElement;

  var node = event_object.target || event_object.srcElement;

  if (node)
  {
	if (node.cell != undefined)
	{
	  if (node.cell.li_item != undefined)
	  {
		if (node.cell.li_item.data_object != undefined)
		{
		  var trigger_object = {
										// let the triggered function have access to the grid itself
										// watchfrog #50
			"grid": this,
										// new things in trigger object
										// watchfrog #30
            "li_item": node.cell.li_item,
            "li_index": node.cell.li_item.li_index,
			"data_object": node.cell.li_item.data_object,
			"attribute": node.cell.attribute,
                                        // also let the triggered function know the actual element changed
            "event_node": event_node
		  };
		  this.pull_triggers(trigger_name, trigger_object);
		}
		else
		{
          if (this.instance_debug_level > 0)
		    this.debug(F, "no node.cell.li_item.data_object");
		}
	  }
	  else
	  {
        if (this.instance_debug_level > 0)
		  this.debug(F, "no node.cell.li_item");
	  }
	}
	else
	{
      if (this.instance_debug_level > 0)
	    this.debug(F, "no node.cell");
	}
  }
  else
  {
    if (this.instance_debug_level > 0)
	  this.debug(F, "no event object target");
  }



  var stop_propagation;
  var return_value;
                                        // trigger object has been set during event handling to cancel this event?
                                        // keyboard handlers will do this if they see an unwanted key
                                        // watchfrog #115
  if (trigger_object.cancel_event)
  {
    stop_propagation = true;
    return_value = false;
  }
  else
                                        // onchanges never stop propagation and return true to continue the cycle
  if (event_object.type == "onchange")
  {
    stop_propagation = false;
    return_value = true;
  }
  else
                                        // clicks on radios allow propagation and return false
  if (event_object.type == "onclick" &&
      node.type == "radio")
  {
    stop_propagation = false;
    return_value = false;
  }
  else
                                        // clicks not on radios don't allow propagation and return false to stop <a href>'s from firing
  if (event_object.type == "onclick")
  {
    stop_propagation = false;
    return_value = false;
  }
                                        // default is to let the event go through the cycle normally
  else
  {
    stop_propagation = false;
    return_value = true;
  }

  if (this.instance_debug_level > 0)
    this.debug(F, "event_node \"" + event_node.id + "\"" +
      " data object attribute \"" + trigger_object.attribute + "\""+
      " " + (stop_propagation? "": "not ") + "stopping propagation" +
      " and returning " + (return_value? "true": "false"));

  if (stop_propagation)
  {
                                          // tell browser not to fire the event again for a containing element
    event_object.cancelBubble = true;
    if (event_object.stopPropagation)
      event_object.stopPropagation();
  }

  return return_value;

} // end method

// -------------------------------------------------------------------------------

dtack_dom_ul_c.prototype.notify_new = function(event_object, trigger_name)
{
  var F = "notify";

  if (!event_object)
    event_object = window.event;

  var event_node = event_object.target || event_object.srcElement;

  if (event_object.type != "keypress")
  {
    if (this.instance_debug_level > 0)
      this.debug(F, "got event on " + this.node_description(event_node));
  }

  var trigger_object = {
                                        // let the triggered function have access to the grid itself
                                        // watchfrog #50
    "grid": this,
                                        // also let the triggered function know the actual element changed
                                        // watchfrog #63
    "event_node": event_node,
    "event_object": event_object
  };

                                        // search upwards in the parental hierarchy for the node with the cell attribute
                                        // this is so that images in the cells will fire the cell's trigger and not their own
  this.notify_search(event_node, 0, event_object, trigger_name, trigger_object);

  var stop_propagation;
  var return_value;
                                        // trigger object has been set during event handling to cancel this event?
                                        // keyboard handlers will do this if they see an unwanted key
                                        // watchfrog #115
  if (trigger_object.cancel_event)
  {
    stop_propagation = true;
    return_value = false;
  }
  else
                                        // onchanges never stop propagation and return true to continue the cycle
  if (event_object.type == "onchange")
  {
    stop_propagation = false;
    return_value = true;
  }
  else
                                        // clicks on radios allow propagation and return false
  if (event_object.type == "onclick" &&
      node.type == "radio")
  {
    stop_propagation = false;
    return_value = false;
  }
  else
                                        // clicks not on radios don't allow propagation and return false to stop <a href>'s from firing
  if (event_object.type == "onclick")
  {
    stop_propagation = false;
    return_value = false;
  }
                                        // default is to let the event go through the cycle normally
  else
  {
    stop_propagation = false;
    return_value = true;
  }

  this.debug(F, (stop_propagation? "": "not ") + "stopping propagation" +
    " and returning " + (return_value? "true": "false"));

  if (stop_propagation)
  {
                                          // tell browser not to fire the event again for a containing element
    event_object.cancelBubble = true;
    if (event_object.stopPropagation)
      event_object.stopPropagation();
  }

  return return_value;

} // end

// -------------------------------------------------------------------------------
// search upwards in the parental hierarchy for the node with the cell attribute
// this is so that images in the cells will fire the cell's trigger and not their own
// watchfrog #60

dtack_dom_ul_c.prototype.notify_search = function(node, depth, event_object, trigger_name, trigger_object)
{
  var F = "notify";

  if (node)
  {
    if (node.cell != undefined)
    {
      if (node.cell.row_item != undefined)
      {
        if (node.cell.row_item.data_object != undefined)
        {
          if (event_object.type != "keypress")
            this.debug(F, this.node_description(node) +
              " is able to trigger \"" + trigger_name + "\"" +
              " of a " + this.classname_of_object(node.cell.row_item.data_object));

                                        // new things in trigger object
                                        // watchfrog #30
          trigger_object["table"] = node.cell.row_item.table;
          trigger_object["row_item"] = node.cell.row_item;
          trigger_object["row_index"] = node.cell.row_item.row_index;
          trigger_object["row_node"] = node.cell.row_item.row_node;
          trigger_object["cell"] = node.cell;
          trigger_object["data_object"] = node.cell.row_item.data_object;
          trigger_object["attribute"] = node.cell.attribute;
          trigger_object["property"] = node.cell.property;

          this.pull_triggers(trigger_name, trigger_object);
        }
        else
        {
          this.debug(F, this.node_description(node) + " has no cell.row_item.data_object");
        }
      }
      else
      {
        this.debug(F, this.node_description(node) + " has no cell.row_item");
      }
    }
    else
    {
      this.debug(F, "at depth " + depth + " " + this.node_description(node) + " sports no cell object");

      this.notify_search(node.parentNode, depth+1, event_object, trigger_name, trigger_object);
    }
  }
  else
  {
    this.debug(F, "at depth " + depth + " found no node with cell in parental hierarchy");
  }

} // end method

// -------------------------------------------------------------------------------
// new method for changing class of lis
// watchfrog #33

dtack_dom_ul_c.prototype.css_classname_single_li = function(li_index, css_classname)
{
  var F = "css_classname_single_li";

  for (var i=0; i<this.li_array.length; i++)
  {
	var li_item = this.li_array[i];

	if (i == li_index)
	{
	  li_item.normal_css_classname = css_classname;
	  li_item.li_node.className = css_classname;
	}
	else
	{
	  li_item.normal_css_classname = li_item.original_css_classname;
	  li_item.li_node.className = li_item.original_css_classname;
	}
  }

} // end method

// -------------------------------------------------------------------------------
// new method for changing class of lis
// watchfrog #33

dtack_dom_ul_c.prototype.css_classname_temporary = function(li_index, css_classname)
{
  var F = "css_classname_temporary";

  var li_item = this.li_array[li_index];

  if (css_classname != undefined)
  {
	li_item.li_node.className = css_classname;
  }
  else
  {
	li_item.li_node.className = li_item.normal_css_classname;
  }

} // end method
