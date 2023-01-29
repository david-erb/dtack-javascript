
// --------------------------------------------------------------------
// discover the row nodes to use for list rows

dtack_dom_table_c.prototype.find_rows_fast = function(control)
{
  var F = "find_rows_fast";

                                        /* remember the find control in case we clone rows */
  this.find_control = control;
                                        /* clear the old list of rows */
  this.rows_array = new Array();

  if (!this.table_node)
    return;

  var row_index;
  var n = this.tbody_node.rows.length;

                                        // traverse all the children of the row node
  for (row_index=0; row_index<n; row_index++)
  {

                                        // discover the cell nodes in the row
    this.find_row_fast(row_index, this.find_control)

  }

} // end method

// --------------------------------------------------------------------
// discover the cell nodes in the row
// watchfrog #25

dtack_dom_table_c.prototype.find_row_fast = function(row_index, control)
{
  var F = "find_row_fast";

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
                                        // the node, for short
                                        // cell ids have to be on <td> tags for this to work
      var cell_node;

                                        // special case to assign properties on the entire row
      if (control.cells[k].id == "row")
      {
        cell_node = row_node;
      }
      else
      {
        cell_node = this.want_first_node_with_id_fast(row_node, control.cells[k].id);
      }

                                        // this will be the cell object associated with the given id
                                        // only one of cell per id even if more than one node
      var cell = new Object();
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

      cell_node.cell = cell;

      cells[k] = cell;

                                        /* control calls for an onclick to pull a trigger? */
      if (control.cells[k].onclick != undefined)
      {
        cell_node.onclick = function(event_object) {return that.notify(event_object, "clicked");}

        cell_node.style.cursor = "pointer";
      }

  }

                                        // watchfrog #86
  row_item.input_validations_array = new Array();
  row_item.input_validations_by_form_name = new Object();
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


// --------------------------------------------------------------------
// all list items will be made invisible
// watchfrog #59

dtack_dom_table_c.prototype.clear_values_fast = function()
{
  var F = "clear_values_fast";

  this.stuff_values_fast({});

} // end method

// --------------------------------------------------------------------
// stuff all items in the list starting at the top of the list
// the the current implementation does not create new items,
// so the list must contain the maximum number which will be desired
// unused list items will be made invisible

dtack_dom_table_c.prototype.stuff_values_fast = function(data_objects, options)
{
  var F = "stuff_values_fast";
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
//      this.debug(F + "_clone", "item index " + itemid +
//        " exceeds the table row capacity so cloning row 0");

                                        /* clone first row and insert it at the end */
      this.clone_row_fast(0);

                                        /* discover the cell nodes in the row */
      this.find_row_fast(itemid, this.find_control);

    }
    else
    {
//      this.debug(F, "item index " + itemid +
//        " does not exceed the table row capacity " + this.rows_array.length)
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
        //alert("row_item.cells[" + c + "] is undefined for " + this.control.cells[c].id);
      }
      else
      if (cell.node)
      {
        //alert("examining cell.node " + this.node_description(cell.node));

                                        // every cell gets a reference to the data object
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
            //alert("stuffing value \"" + value + "\" for row_item.cells[" + c + "] on row " + k + " for attribute \"" + cell.attribute + "\"");
            this.stuff_value_fast(cell.node, value, cell.property);
          }
          else
          {
            //alert("no value for row_item.cells[" + c + "] on row " + k + " for attribute \"" + cell.attribute + "\"");
            // cell.node.innerHTML = "-";
          }
        }
        else
        {

          //alert("no attribute for row_item.cells[" + c + "] on row " + k + " for cell id " + this.control.cells[c].id);
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
//      this.debug(F, "stopping stuffing at table capacity " + this.rows_array.length);
      break;
    }
  }

//  this.debug(F, "after stuffing, need to release and hide itemid from " + itemid + " to " + this.rows_array.length);

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

// -------------------------------------------------------------------------------
// stuff a single value into a node

dtack_dom_table_c.prototype.stuff_value_fast = function(node, value, property)
{
  var F = "stuff_value_fast";

  //alert("property " + property + " for " + this.node_description(node));

  if (property == "classname")
  {
    node.className = value;
  }
  else
  {
    node.innerHTML = value;
  }

} // end method

// -------------------------------------------------------------------------------
// returns a dtack_row_c object or null

dtack_dom_table_c.prototype.clone_row_fast = function(row_index)
{
  var F = "clone_row_fast";

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

// --------------------------------------------------------------------
// search recursively for the first node in the given container with the given id
// case is ignored
// if not found, make a debug statement and return null (no error)

dtack_dom_table_c.prototype.want_first_node_with_id_fast = function(container, id)
{
  var F = "want_first_node_with_id_fast";

  for (var i=0; i<container.childNodes.length; i++)
  {
    var node = container.childNodes[i];
    if (node.id != undefined &&
        node.id == id)
    {
      return node;
    }
  }

  return null;

} // end method
