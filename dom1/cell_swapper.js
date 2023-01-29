/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 
  ! THIS FILE IS A COMPONENT OF THE DTACK_JAVASCRIPT LIBRARY
  ! Copyright (C) 2009 Dtack Inc. All Rights Reserved
  ! This software is provided AS IS with no warranty expressed or implied.
  ! Dtack Inc. accepts no liability for use or misuse of this file.
  ! http://www.dtack.com  dtack@dtack.com  telephone +360.670.5775
  ! Dtack Inc., 1009 Homestead Ave., Port Angeles, WA USA 98362
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */


// this object represents a set of mutually exclusive nodes

// --------------------------------------------------------------------
										// inherit the base methods and variables
dtack_dom_cell_swapper_c.prototype = new dtack_base2_c();
										/* remember who the base class is */
dtack_dom_cell_swapper_c.prototype.parent = dtack_base2_c;

function dtack_dom_cell_swapper_c(dtack_environment)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {

	var F = "dtack_dom_cell_swapper_c";
										// initilialize the base instance variables
	this.construct(dtack_environment, F);
  }

}

// --------------------------------------------------------------------
// one-time initialization of the state swapper
// you give it something like {state1: id1, state2: id2...}

dtack_dom_cell_swapper_c.prototype.initialize = function(list, attributes)
{
  var F = "initialize";

  this.poke_attributes(attributes);

  this.list = new Object();
										/* for each of the mutually exclusive nodes */
  for (var state in list)
  {
	this.register_state(state, list[state]);
  }
} // end method

// --------------------------------------------------------------------
// add a state after inialize

dtack_dom_cell_swapper_c.prototype.register_state = function(state, id)
{
  var F = "register_state";

  var node = this.want_element(F, id);

  if (node != undefined)
  {
	this.list[state] = {
	  "node": node
	};

	if (this.container == undefined)
	{
	  this.container = node.parentNode;

	  this.front_node = node;
	}

	this.sizer = this.want_first_node_with_tagname(node, "DIV");

	this.debug(F, "sizer is " + this.node_description(this.sizer));
	
	if (this.sizer)
	{
	  this.sizer.style.width = this.peek_attribute("sizer_width", "500px");
	  this.sizer.style.height = this.peek_attribute("sizer_height", "500px");
	  this.sizer.style.overflow = "hidden";
	}
	
	  //this.debug(F, "container is " + this.node_description(this.container) +
	  //  " with front node " + this.node_description(this.front_node) +
	  //  " whose parent is " + this.node_description(this.front_node.parentNode));

  }

} // end method

// --------------------------------------------------------------------

dtack_dom_cell_swapper_c.prototype.show = function(want_state, options)
{
  var F = "show";

										/* already in the state? */
  if (this.state == want_state)
    return;

  this.debug(F, "swapping (simple) to state \"" + want_state + "\"");

										/* for short */
  var node = this.list[want_state].node;
										/* we have a dom node for this named state */
  if (node)
  {
	//this.debug(F, "inserting " + this.node_description(node) +
	//  " in front of front node " + this.node_description(this.front_node));

	//this.debug(F, "parent of front_node is" + this.node_description(this.front_node.parentNode));
	//this.debug(F, "parent of new node is" + this.node_description(node.parentNode));
	
	this.container.insertBefore(node, this.front_node);

	this.front_node = node;
  }

  this.state = want_state;

} // end method

