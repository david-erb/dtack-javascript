/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 
  ! THIS FILE IS A COMPONENT OF THE DTACK_JAVASCRIPT LIBRARY
  ! Copyright (C) 2009 Dtack Inc. All Rights Reserved
  ! This software is provided AS IS with no warranty expressed or implied.
  ! Dtack Inc. accepts no liability for use or misuse of this file.
  ! http://www.dtack.com  dtack@dtack.com  telephone +360.670.5775
  ! Dtack Inc., 1009 Homestead Ave., Port Angeles, WA USA 98362
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */


// this object represents a list/item system using LI nodes with one A and one SPAN in them

// --------------------------------------------------------------------
										// inherit the base methods and variables
dtack_dom_ul_link_span_c.prototype = new dtack_base2_c();
										/* remember who the base class is */
dtack_dom_ul_link_span_c.prototype.parent = dtack_base2_c;

function dtack_dom_ul_link_span_c(dtack_environment)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {

	var F = "dtack_dom_ul_link_span_c";
										// initilialize the base instance variables
	this.construct(dtack_environment, F);
  }

}

// --------------------------------------------------------------------
// one-time initialization of the month view object 

dtack_dom_ul_link_span_c.prototype.initialize = function(control)
{
  var F = "initialize";

										// discover the nodes to use for list items
  this.find_items(control);

} // end method

// --------------------------------------------------------------------
// discover the nodes to use for list items

dtack_dom_ul_link_span_c.prototype.find_items = function(control)
{
  var F = "find_items";
										/* clear the old list of items */
  this.items_array = new Array();

										/* find the <ul> holding the items */
  this.items_container = this.want_element(F, control.ul_id);

  if (!this.items_container)
    return;

  var that = this;

  var itemid = 0;
  var i;
  var n = this.items_container.childNodes.length;

  //this.debug(F, this.node_description(this.items_container) + " has " + n + " total child nodes");

										// traverse all the children of the ul node
  for (i=0; i<n; i++)
  {
	var item_node = this.items_container.childNodes[i];

										/* ignore children that are not li nodes */
	if (item_node.tagName != undefined &&
	    item_node.tagName.toLowerCase() == "li")
	{
										/* discover the link and span nodes inside the li node */
	  var link_node = this.want_first_node_with_id(item_node, control.link_id);
	  var span_node = this.want_first_node_with_id(item_node, control.span_id);

										/* caller is providing an initial class for the links? */
	  if (control != undefined &&
	      control.link_class != undefined)
	  {
										// clear the class which the designer might have left in the html
		link_node.className = control.link_class;
	  }

	  //this.debug(F, i + ". adding " + this.node_description(item_node) + " as item " + d);

										/* keep a reusable array of the li nodes */
	  this.items_array[itemid] = {
		"item_node": item_node,
		"link_node": link_node,
		"span_node": span_node,
	  };

										/* link node refers to its item object for use in event*/
	  link_node.item_object = this.items_array[itemid];

										/* attach event handler to the item's link */
	  link_node.onmousedown = function(event_object) {return that.clicked_item(event_object);}

	  itemid++;
	}
	else
	{
	  //this.debug(F, i + ". skipping " + this.node_description(item_node));
	}

  }

  //this.debug(F, this.node_description(this.items_container) + " has " + itemid + " LI child nodes");

} // end method

// --------------------------------------------------------------------

dtack_dom_ul_link_span_c.prototype.clicked_item = function(event_object)
{
  if (!event_object)
    event_object = window.event;

  var clicked_node = event_object.target || event_object.srcElement;

										// hide the focus rectangle to prevent brief display of scrollbar
  clicked_node.blur();
										/* notify any listeners on the item click */
										/* provide the item object s*/
										// use item_object.data_object to get the original as stuffed
										// use item_object.link_node to change css if desired
  this.pull_triggers("clicked_item", clicked_node.item_object);

										/* make sure to return false to inhibit the href */
  return false;

} // end method

// --------------------------------------------------------------------
// stuff all items in the list starting at the top of the list
// the the current implementation does not create new items, 
// so the list must contain the maximum number which will be desired
// unused list items will be made invisible

dtack_dom_ul_link_span_c.prototype.stuff_values = function(data_objects, control)
{
  var F = "stuff_values";
  var value;

										/* start stuffing at the beginning of the list */
  var itemid = 0;
										/* for every given data_object */
  for (var k in data_objects)
  {
										/* for short */
	var item = this.items_array[itemid];

										/* list item keeps reference to original data_object */
	item.data_object = data_objects[k];

										/* data_object field provides link display values */
	if (control.link_field != undefined &&
	    (value = data_objects[k][control.link_field]) != undefined)
	{
	  item.link_node.innerHTML = value;
	  item.link_node.style.display = "block";
	}
	else
	{
	  item.link_node.innerHTML = "";
	  item.link_node.style.display = "none";
	}

										/* data_object field provides link display class */
										/* this is so we can specify a highlighted item if desired */
	if (control.link_class != undefined &&
	    (value = data_objects[k][control.link_class]) != undefined)
	{
	  item.link_node.className = value;
	}


										/* data_object field provides span display values */
	if (control.span_field != undefined &&
	    (value = data_objects[k][control.span_field]) != undefined)
	{
	  item.span_node.innerHTML = value;
	  item.span_node.style.display = "block";
	}
	else
	{
	  item.span_node.innerHTML = "";
	  item.span_node.style.display = "none";
	}
	
	itemid++;
										/* stop stuffing items when the list is full */
	if (itemid == this.items_array.length)
	  break;
  }

										/* for all the remaining LI items */
  while (itemid < this.items_array.length)
  {
										/* for short */
	var item = this.items_array[itemid];
										/* release the data object */
	item.data_object = null;
										/* hide the item completely */
	item.span_node.style.innerHTML = "";
	item.span_node.style.display = "none";
	item.link_node.style.innerHTML = "";
	item.link_node.style.display = "none";

	itemid++;
  }


} // end method


// --------------------------------------------------------------------
// traverse all items in the display list

dtack_dom_ul_link_span_c.prototype.traverse = function(object, method)
{
  var F = "traverse";
										/* start stuffing at the beginning of the list */
  var itemid = 0;
										/* for all the LI items */
  while (itemid < this.items_array.length)
  {
										/* for short */
	var item = this.items_array[itemid];

	if (item.data_object != null)
	  object[method](item);

	itemid++;
  }


} // end method

