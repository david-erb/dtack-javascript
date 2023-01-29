// --------------------------------------------------------------------
// class representing a DOM table

										// inherit the base methods and variables
dtack_dom_table_c.prototype = new dtack_base2_c();

										// override the constructor
dtack_dom_table_c.prototype.constructor = dtack_dom_table_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack_dom_table_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack_dom_table_c";

	this.parent = dtack_base2_c.prototype;

	if (classname == undefined)
	  classname = F;
										/* call the base class constructor helper */
	this.parent.constructor.call(this, dtack_environment, classname);
  }

  var expand_table_for_stuff = "no";

                                        // keep debug volume down
                                        // important for sqlite logging applications
                                        // watchfrog #140
  var verbose = false;
}

// -------------------------------------------------------------------------------
dtack_dom_table_c.prototype.initialize = function(table_id)
{
  var F = "initialize";

  var table_node = this.want_element(F, table_id);

  this.initialize_from_node(table_node);

} // end method

// -------------------------------------------------------------------------------
dtack_dom_table_c.prototype.initialize_from_node = function(table_node)
{
  var F = "initialize";

  if (table_node)
  {
	this.table_node = table_node;
										/* common name for instance variable */
										/* watchfrog #52 */
	this.grid_node = this.table_node;

	this.table_id = this.table_node.id;

	this.debug_identifier = this.table_id;

	if (this.table_node.tagName.toLowerCase() == "table")
	{
	  this.tbody_node = this.table_node.tBodies[0];

	  //this.debug(F, this.node_description(this.table_node) + " initialized");
	}
	else
	{
	  this.debug(F, this.node_description(this.table_node) + " is not a table");

	  this.table_node = undefined;
	}
  }
  else
  {
	this.debug(F, "invalid node");
  }

} // end method

// --------------------------------------------------------------------
// discover the row nodes to use for list rows

dtack_dom_table_c.prototype.find_rows = function(control)
{
  var F = "find_rows";

										/* remember the find control in case we clone rows */
  this.find_control = control;
										/* clear the old list of rows */
  this.rows_array = new Array();

  if (!this.table_node)
    return;

  var row_index;
  var n = this.tbody_node.rows.length;

                                        // watchfrog #88
  this.use_model_to_clone = control.use_model_to_clone;
  if (this.use_model_to_clone)
    this.model_node = this.tbody_node.rows[0].cloneNode(true);


  //this.debug(F, this.node_description(this.tbody_node) + " has " + n + " indexed rows");

										// traverse all the children of the row node
  for (row_index=0; row_index<n; row_index++)
  {

										// discover the cell nodes in the row
	this.find_row(row_index, this.find_control)

	//this.debug(F, i + ". adding " + this.node_description(row_node) + " as row " + d);

  }

  //this.debug(F, this.node_description(this.tbody_node) + " has " + this.rows_array.length + " TR child nodes");

} // end method

// --------------------------------------------------------------------
// discover the cell nodes in the row
// watchfrog #25

dtack_dom_table_c.prototype.find_row = function(row_index, control)
{
  var F = "find_row";

  this.control = control;

  var row_node = this.tbody_node.rows[row_index];

  var that = this;

  var cells = new Array();

  var row_item = {
										// new things in row item object
										// watchfrog #32
    "table": this,
    "row_index": row_index,
	"row_node": row_node,
	"original_css_classname": row_node.className,
	"normal_css_classname": row_node.className,
	"cells": cells};
										/* keep a reusable array of the row nodes */
  this.rows_array[row_index] = row_item;

										/* for every cell of interest */
  for (var k in control.cells)
  {
  	if (!control.cells[k].id || !control.cells[k].id)
  	  continue;
                                        // this will be the cell object associated with the given id
                                        // only one of cell per id even if more than one node
    var cell = undefined;
                                        // find all the nodes in the row with the given id
                                        // watchfrog #80
    var all_nodes_with_id;
                                        // allow the row itself to be indicated by special id
                                        // watchfrog #109
    if (control.cells[k].id == "@row_node")
      all_nodes_with_id = [row_node];
    else
      all_nodes_with_id = this.all_nodes_with_id(row_node, control.cells[k].id);

    if (this.verbose)
      this.debug(F, "on row_index [" + row_index + "]" +
        " found " + all_nodes_with_id.length + " nodes with id " + control.cells[k].id);

                                        // for every node in the row with the given id
    for (var k2 in all_nodes_with_id)
    {
                                        // the node, for short
      var cell_node = all_nodes_with_id[k2];

                                        // first node with given id?
	  if (cell == undefined)
	  {
	    cell = new Object();
                                        // let the cell have a reference to its control
                                        // so it can look into the control at event handling time
                                        // watchfrog #78
	    cell.control = control.cells[k];

	    cell.id = control.cells[k].id;
	    cell.attribute = control.cells[k].attribute;
	    cell.property = control.cells[k].property;
                                        // first node found for a cell is the primary one
	    cell.node = cell_node;
										/* every cell refers back to the row item it is on */
  	    cell.row_item = row_item;
  	  }


                                        // the rest of this happens for the primary and all the secondary nodes
										/* node gets cell attribute so we can get it during events */
                                        // there are places in the code which depend on this being the only thing the node gets
                                        // for example, to clear a FILE input field, you have to clone and replace the node
                                        // in order for the new node to generate events right, you have to replace the cell reference too
                                        // if too much stuff is changed in this area, you will break for example panelizer/javascript/panel_base.js
                                        // eztask #7972: clear picture slots file input area after upload
	  cell_node.cell = cell;

                                        /* control calls for a trigger to pull when this cell is found? */
                                        // watchfrog #99
      if (this.find_control.trigger_when_cell_found != undefined &&
          control.cells[k].trigger_when_cell_found != undefined)
      {
        this.find_control.trigger_when_cell_found.pull_triggers(control.cells[k].trigger_when_cell_found, cell);
      }

                                        /* control calls for an onclick to pull a trigger? */
      if (control.cells[k].onclick != undefined)
      {
        cell_node.onclick = function(event_object) {return that.notify(event_object, "clicked");}

        cell_node.style.cursor = "pointer";
      }
										/* control calls for an onmouse to pull a trigger? */
										// watchfrog #31
	  if (control.cells[k].onmouse != undefined)
	  {
		cell_node.onmouseover = function(event_object) {return that.notify(event_object, "mouse_over");}
		cell_node.onmouseout = function(event_object) {return that.notify(event_object, "mouse_out");}
	  }

                                        /* control calls for a change event to pull a trigger? */
                                        // watchfrog #62
      if (control.cells[k].onchange != undefined)
      {
        cell_node.onchange = function(event_object) {return that.notify(event_object, "changed");}
      }

                                        /* control calls for a key event to pull a trigger? */
                                        // watchfrog #109
      if (control.cells[k].onkeypress != undefined)
      {
        cell_node.onkeypress = function(event_object) {return that.notify(event_object, "keypress");}
      }

	}


	if (cell != undefined)
	{
                                        // use the original index from the control
                                        // to make debugging better
                                        // watchfrog #NN
	  cells[k] = cell;
	}
	else
	{
      if (this.instance_debug_level > 0)
        this.debug(F, "cell[" + k + "] ignored because no nodes found with id \"" + control.cells[k].id + "\"");
	}
  }

                                        // watchfrog #86
  row_item.input_validations_array = new Array();
  row_item.input_validations_by_form_name = new Object();

  var form_nodes = row_node.getElementsByTagName("form");
  if (this.verbose)
    this.debug(F, "there were " + form_nodes.length + " forms in the row");

                                        // traverse all the forms in the dom table row
  if (form_nodes.length)
  for (var f=0; f<form_nodes.length; f++)
  {
  	var form_node = form_nodes[f];

    var input_validations = new dtack_input_validations_c(this.dtack_environment);

                                        // find all the input validations in this form
    input_validations.initialize_form(row_node, form_node);

    input_validations.hide_error_conditions();

    row_item.input_validations_array.push(input_validations);

    row_item.input_validations_by_form_name[form_node.name] = input_validations;

    this.debug(F, "input_validations_by_form_name[" + form_node.name + "]" +
      " has " + input_validations.validations_count + " validations");
  }
                                        /* control calls for a trigger to pull when the input validations are found? */
                                        // watchfrog #103
//  if (this.find_control.trigger_when_input_validations_found != undefined)
//  {
//    this.find_control.trigger_when_input_validations_found.pull_triggers("input_validations_found", this);
//  }

} // end method

// -------------------------------------------------------------------------------
// set all input fields on the panel to default values

dtack_dom_table_c.prototype.reset_input_fields = function()
{
  var F = "reset_input_fields";
  										/* for all the rows */
  for (var itemid=0; itemid<this.rows_array.length; itemid++)
  {
										/* for short */
	var row_item = this.rows_array[itemid];
										/* we released the data object? */
	if (row_item.data_object == null)
	  break;

    for (var i=0; i<row_item.input_validations_array.length; i++)
    {
      //this.debug(F, "resetting row " + itemid + " form " + i);

      row_item.input_validations_array[i].reset();
    }
  }

} // end method


// -------------------------------------------------------------------------------
// poke choices into a select box on all rows

dtack_dom_table_c.prototype.poke_choicelists = function(id, choicelist)
{
  var F = "poke_choicelists";
  										/* for all the rows */
  for (var itemid=0; itemid<this.rows_array.length; itemid++)
  {
										/* for short */
	var row_item = this.rows_array[itemid];

    this.debug(F, "poking choicelist on row " + itemid);

    for (var i=0; i<row_item.input_validations_array.length; i++)
    {
      this.debug(F, "poking choicelist on row " + itemid + " form " + i);

      row_item.input_validations_array[i].poke_choicelist(id, choicelist);
    }
  }

} // end method


// -------------------------------------------------------------------------------
// watchfrog #86

dtack_dom_table_c.prototype.validate_input_fields = function()
{
  var F = "validate_input_fields";

  var ok = true;
  										/* for all the rows */
  for (var itemid=0; itemid<this.rows_array.length; itemid++)
  {
										/* for short */
	var row_item = this.rows_array[itemid];
										/* we released the data object? */
	if (row_item.data_object == null)
	  break;

    for (var i=0; i<row_item.input_validations_array.length; i++)
    {
      ok &= row_item.input_validations_array[i].validate();
    }
  }

  if (!ok && row_item.input_validations_array.length > 0)
    this.debug(F, "one or more input forms out of " + row_item.input_validations_array.length + " is invalid");

  return ok;
} // end method

// -------------------------------------------------------------------------------
// watchfrog #89

dtack_dom_table_c.prototype.validate_node = function(row_item, node)
{
  var F = "validate_node";

  var ok = true;

  if (row_item.input_validations_array.length == 0)
  {
      this.debug(F, this.node_description(node) +
        " \"" + node.value + "\"" +
        " is assumed valid in row " + row_item.row_index +
        " because there are no input validations on the row");

  }
  else
  for (var i=0; i<row_item.input_validations_array.length; i++)
  {
  	if (row_item.input_validations_array[i].form.name == node.form.name)
  	{
                                        // strip the row_index indicator off the id of the presented node
                                        // this is added, for example, by panelizer_panel_base_c::wrap_datepicker()
                                        // watchfrog #102
      var node_id = node.id.replace(/[:][0-9]+$/, "");

      var ok1 = row_item.input_validations_array[i].validate1_by_id(node_id);

      this.debug(F, this.node_description(node) +
        " \"" + node.value + "\"" +
        (ok1? " is": " is not") + " valid in row " + row_item.row_index +
        " on form " + node.form.name);

      ok &= ok1;
    }
  }


  return ok;
} // end method

// --------------------------------------------------------------------
// all list items will be made invisible
// watchfrog #59

dtack_dom_table_c.prototype.clear_values = function()
{
  var F = "clear_values";

  this.stuff_values({});

} // end method

// --------------------------------------------------------------------
// stuff all items in the list starting at the top of the list
// the the current implementation does not create new items,
// so the list must contain the maximum number which will be desired
// unused list items will be made invisible

dtack_dom_table_c.prototype.stuff_values = function(data_objects, options)
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
    itemid = this.rows_array.length;
                                        /* for every given data_object */
                                        // NOTE!! this pulls objects out in order of their index numerical or lexical value
                                        // not the order in which they came in the object definition string
  for (var k in data_objects)
  {
  	if (data_objects[k].should_inhibit_stuffing)
  	  continue;
                                        // protect against empty data object when stuffing
                                        // watchfrog #75
    if (!data_objects[k])
    {
      this.debug(F, "data_objects[" + k + "] is empty");
      continue;
    }

    //this.debug(F, "stuffing data_objects[" + k + "] is not empty");
                                        /* we have exceeded row capacity? */
                                        // watchfrog #26
    if (itemid >= this.rows_array.length)
    {
      if (this.verbose)
        this.debug(F + "_clone", "item index " + itemid +
          " exceeds the table row capacity so cloning row 0");

                                        /* clone first row and insert it at the end */
      this.clone_row(0);

                                        /* discover the cell nodes in the row */
      this.find_row(itemid, this.find_control);

    }
    else
    {
      if (this.verbose)
        this.debug(F, "item index " + itemid +
          " does not exceed the table row capacity " + this.rows_array.length)
    }

                                        /* for short */
    var row_item = this.rows_array[itemid];
                                        /* list row keeps reference to original data_object */
    row_item.data_object = data_objects[k];

                                        // this lets the row itself refer to the stuff we know about it
                                        // this is for sorting the rows
                                        // watchfrog #64
    row_item.row_node.row_item = row_item;

                                        /* for every cell of interest */
    for (var c in row_item.cells)
    {
                                        /* reference the cell on this row */
      var cell = row_item.cells[c];

      if (cell == undefined)
      {
                                        // make better debug for missing control cells
                                        // watchfrog #76
        this.debug(F, "row_item.cells[" + c + "] is undefined for " + this.control.cells[c].id);
      }
      else
      if (cell.node)
      {                                 // every cell gets a reference to the data object
                                        // watchfrog #100
        cell.data_object = data_objects[k];

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

                                        /* control calls for a trigger to pull after this cell is stuffed? */
                                        // watchfrog #101
            if (this.find_control.trigger_after_cell_stuffed != undefined &&
                cell.control.trigger_after_cell_stuffed != undefined)
            {
              this.debug(F, "triggering after cell stuffed data_objects[" + k + "].autoid #" + cell.data_object.autoid)
              this.find_control.trigger_after_cell_stuffed.pull_triggers(cell.control.trigger_after_cell_stuffed, cell);
            }

            // cell.node.innerHTML = value;
          }
          else
          {
            // cell.node.innerHTML = "-";
          }
        }
      }

    }
                                        /* show the entire row */
                                        // don't use display: block on a row (messes up FF columnization)
                                        // watchfrog #77
    row_item.row_node.style.display = "";

                                        // data coming from server specifies a row style?
    if (data_objects[k].dtack_dom_table_row_css_class != undefined)
    {
      row_item.row_node.className = data_objects[k].dtack_dom_table_row_css_class;
    }
                                        // data coming from server specifies no row style?
    else
    {
      row_item.row_node.className = "";
    }
                                        // reset the original and normal row classnames when stuffing values
                                        // watchfrog #68
    row_item.normal_css_classname = row_item.row_node.className;
    row_item.original_css_classname = row_item.row_node.className;

    itemid++;
                                        /* stop stuffing items when the list is full */
    if (this.expand_table_for_stuff != "yes" &&
        itemid == this.rows_array.length)
    {
      this.debug(F, "stopping stuffing at table capacity " + this.rows_array.length);
      break;
    }
  }

  this.debug(F, "after stuffing, need to release and hide itemid from " + itemid + " to " + this.rows_array.length);

                                        /* for all the remaining rows */
  while (itemid < this.rows_array.length)
  {
                                        /* for short */
    var row_item = this.rows_array[itemid];
                                        /* release the data object */
    row_item.data_object = null;
    row_item.row_node.row_item = null;
                                        /* hide the row_item completely */
    row_item.row_node.style.display = "none";

    itemid++;
  }


} // end method

// --------------------------------------------------------------------
// stuff just one column
// make no new rows
// data objects are assumed in the same order as original rows
// watchfrog #118

dtack_dom_table_c.prototype.stuff_column = function(data_objects, column_name, options)
{
  var F = "stuff_column";
  var value;

                                        /* start stuffing at the beginning of the list */
  var itemid = 0;
                                        /* for every given data_object */
  for (var k in data_objects)
  {

                                        /* we have exceeded row capacity? */
                                        // watchfrog #26
    if (itemid >= this.rows_array.length)
    {
      this.debug(F + "_stuff", "item index " + itemid +
        " exceeds the table row capacity so cloning row 0");

      break;
    }

                                        /* for short */
    var row_item = this.rows_array[itemid];
    var data_object = data_objects[k];
                                        // protect against empty data object when stuffing
                                        // watchfrog #75
    if (!data_object)
    {
                                        // skip stuffing this row
      this.debug(F, "data_objects[" + k + "] is empty");
    }
    else
    {

                                        /* reference the cell on this row */
      var cell = row_item.cells[column_name];

      if (cell == undefined)
      {
                                        // make better debug for missing control cells
                                        // watchfrog #76
        this.debug(F, "row_item.cells[" + column_name + "] is undefined");
      }
      else
      if (cell.node == undefined)
      {
        this.debug(F, "row_item.cells[" + column_name + "] has no node");
      }
      else
      if (cell.attribute == undefined)
      {
        this.debug(F, "row_item.cells[" + column_name + "] has no attribute");
      }
      else
      {
        var value = data_objects[k][cell.attribute];

        if (value == undefined)
        {
          this.debug(F, "data_objects[" + k + "][" + cell.attribute + "] is undefined");
        }
        else
        {
          this.stuff_value(cell.node, value, cell.property);
        }
      }
    }

    itemid++;
  }

} // end method

// -------------------------------------------------------------------------------
// stuff a single value into a node

dtack_dom_table_c.prototype.stuff_value = function(node, value, property)
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
	this.debug(F, "cannot stuff " + this.node_description(node));
  }

} // end method

// -------------------------------------------------------------------------------
// stuff a single value into a node

dtack_dom_table_c.prototype.fetch_value = function(node)
{
  var F = "fetch_value";

  var tagname = node.tagName.toUpperCase();

  var value = "";

  if (tagname == "DIV" ||
      tagname == "SPAN" ||
      tagname == "LEGEND" ||
      tagname == "TD")
  {
	value = node.innerHTML;
  }
  else
  if (tagname == "INPUT" ||
      tagname == "TEXTAREA")
  {
  	if (node.type == "checkbox")
  	{
      value = node.checked? node.value: "";
  	}
  	else
                                        // find radio value by searching among the radio group for one that is checked
                                        // watchfrog #79
  	if (node.type == "radio")
  	{
  	  value = undefined;
  	  for (var i=0; i<node.form.elements.length; i++)
      {
        if (node.form.elements[i].name == node.name)
        {
          if (node.form.elements[i].checked)
          {
            value = node.form.elements[i].value;
            this.debug(F, "elements[" + i + "] " +
              this.node_description(node.form.elements[i]) + " is checked");
            break;
          }
          else
          {
            this.debug(F, "elements[" + i + "] " +
              this.node_description(node.form.elements[i]) + " is not checked");
          }
        }
      }
  	}
  	else
  	{
	  value = node.value;
	}
  }
  else
  if (tagname == "IMG")
  {
	value = node.src;
  }
  else
  if (tagname == "SELECT")
  {
  	if (node.selectedIndex >= 0 &&
  	    node.selectedIndex < node.options.length)
  	{
  	  value = node.options[node.selectedIndex].value;
  	}
  	else
  	{
  	  value = "";
  	}
  }
  else
  {
	this.debug(F, "cannot fetch value from node tag " + this.node_description(node));
	return "";
  }

  this.debug(F, "fetched \"" + value + "\" from " + this.node_description(node));

  return value;

} // end method

// -------------------------------------------------------------------------------
// returns a dtack_row_c object or null

dtack_dom_table_c.prototype.clone_row = function(row_index)
{
  var F = "clone_row";

  if (this.use_model_to_clone)
    return this.model_row();

  var row = null;

  if (this.table_node)
  {
										/* watchfrog #24 */
	if (row_index < this.tbody_node.rows.length)
	{

	  var row_node = this.tbody_node.rows[row_index];

	  row = new dtack_dom_row_c(this.dtack_environment);

	  row.initialize(row_node);

	  row.clone();
	}
	else
	{
	  this.debug(F,
	    "table tbodies[0] only has " + this.tbody_node.rows.length + " rows" +
	    " so can't show row " + row_index);
	}
  }
  else
  {
	this.debug(F, "table with id \"" + this.table_id + "\" was never found");
  }

  return row;
} // end method

// -------------------------------------------------------------------------------
// returns a dtack_row_c object or null
// watchfrog #88

dtack_dom_table_c.prototype.model_row = function()
{
  var F = "model_row";

  var row = null;

  if (this.table_node)
  {

	var row_node = this.tbody_node.rows[0];

	row = new dtack_dom_row_c(this.dtack_environment);

	row.initialize(row_node);

    if (this.instance_debug_level > 0)
	  this.debug(F + "_clone", "cloning from model row");

	row.clone_from_model(this.model_node, this.tbody_node);
  }
  else
  {
	this.debug(F, "table with id \"" + this.table_id + "\" was never found");
  }

  return row;
} // end method

// -------------------------------------------------------------------------------

dtack_dom_table_c.prototype.notify = function(event_object, trigger_name)
{
  var F = "notify";

  if (!event_object)
    event_object = window.event;

  var event_node = event_object.target || event_object.srcElement;

  if (event_object.type != "keypress")
    this.debug(F, "got event on " + this.node_description(event_node));

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

  this.debug(F, event_object.type + " " +
    (stop_propagation? "": "not ") + "stopping propagation" +
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

dtack_dom_table_c.prototype.notify_search = function(node, depth, event_object, trigger_name, trigger_object)
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

dtack_dom_table_c.prototype.apply_cell_widths = function(table_node)
{
  var F = "apply_cell_widths";

  if (table_node)
  {
	if (table_node.tBodies)
	{
	  var target_rows = table_node.tBodies[0].rows;
	  var target_row = target_rows[0];

	  var source_cells = this.tbody_node.rows[0].cells;

	  for (var i=0; i<target_row.cells.length; i++)
	  {
		if (i >= source_cells.length)
		  break;

		target_row.cells[i].style.width = source_cells[i].clientWidth + "px";

		this.debug(F, i + ". " + source_cells[i].clientWidth + "px so now " + target_row.cells[i].style.width);

	  }

      this.debug(F, "applied " + i + " widths");
	}
	else
	{
	  this.debug(F, "no tbodies in target table node");
	}
  }
  else
  {
    this.debug(F, "not given a table node");
  }

} // end method

// -------------------------------------------------------------------------------
// new method for changing class of rows
// watchfrog #33

dtack_dom_table_c.prototype.css_classname_single_row = function(row_index, css_classname)
{
  var F = "css_classname_single_row";

  for (var i=0; i<this.rows_array.length; i++)
  {
	var row_item = this.rows_array[i];

	if (i == row_index)
	{
	  row_item.normal_css_classname = css_classname;
	  row_item.row_node.className = css_classname;
	}
	else
	{
	  row_item.normal_css_classname = row_item.original_css_classname;
	  row_item.row_node.className = row_item.original_css_classname;
	}
  }

} // end method

// -------------------------------------------------------------------------------
// new method for changing class of rows
// watchfrog #33

dtack_dom_table_c.prototype.css_classname_temporary = function(row_index, css_classname)
{
  var F = "css_classname_temporary";

  var row_item = this.rows_array[row_index];

  if (css_classname != undefined)
  {
	row_item.row_node.className = css_classname;
  }
  else
  {
	row_item.row_node.className = row_item.normal_css_classname;
  }

} // end method

// -------------------------------------------------------------------------------
// new method to class of rows to their original css classname
// watchfrog #67

dtack_dom_table_c.prototype.css_classname_original = function()
{
  var F = "css_classname_original";

  for (var i=0; i<this.rows_array.length; i++)
  {
	var row_item = this.rows_array[i];
    row_item.normal_css_classname = row_item.original_css_classname;
    row_item.row_node.className = row_item.original_css_classname;
  }

} // end method

// -------------------------------------------------------------------------------
// reorder internal array according to current dom
// watchfrog #65

dtack_dom_table_c.prototype.apply_list_order_from_dom = function()
{
  var F = "apply_list_order_from_dom";

  var row_index;
  var n = this.tbody_node.rows.length;

    									/* new array of the row nodes in their dom order */
  var rows_array = new Array();

										// traverse all the children of the tbody node
  for (row_index=0; row_index<n; row_index++)
  {
                                        // dom node for the row
    var row_node = this.tbody_node.rows[row_index];

                                        // row item in the table's dom order
    var dom_row_item = row_node.row_item;

    if (dom_row_item)
    {
                                        // row item in our internal order
      var our_row_item = this.rows_array[row_index];

      if (our_row_item)
      {
        dom_row_item.row_index = row_index;
                                        // add item to new order array
        rows_array[row_index] = dom_row_item;
      }
    }
  }

  this.rows_array = rows_array;

} // end method
