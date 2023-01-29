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
dtack_dom_visibility_swapper_c.prototype = new dtack_base2_c();
										/* remember who the base class is */
dtack_dom_visibility_swapper_c.prototype.parent = dtack_base2_c;

function dtack_dom_visibility_swapper_c(dtack_environment)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {

	var F = "dtack_dom_visibility_swapper_c";
										// initilialize the base instance variables
	this.construct(dtack_environment, F);
  }

}

// --------------------------------------------------------------------
// one-time initialization of the state swapper
// you give it something like {state1: id1, state2: id2...}
// added attributes watchfrog #47

dtack_dom_visibility_swapper_c.prototype.initialize = function(list, attributes)
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
// add a state after initialize
// watchfrog #27

dtack_dom_visibility_swapper_c.prototype.register_state = function(state, id)
{
  var F = "register_state";

  var node = this.want_element(F, id);

  var showing;
  var display;

  if (this.peek_attribute("register_showing", "no") == "no")
  {
	showing = false;
	display = "none";
  }
  else
  {
	showing = true;
	display = "block";
  }

  if (node != undefined)
  {
	this.list[state] = {
	  "node": node,
	  "showing": showing
	};

	node.style.display = display;
  };

} // end method

// --------------------------------------------------------------------

dtack_dom_visibility_swapper_c.prototype.show = function(want_state, options)
{
  var F = "show";

  if (this.peek_attribute("toggle_effect"))
  {
	this.toggle_effect(want_state, options);
	return;
  }

  if (this.peek_attribute("show_effect"))
  {
	this.show_effect(want_state, options);
	return;
  }

  if (this.state == want_state)
    return;

  this.debug(F, "swapping (simple) to state \"" + want_state + "\"");

										/* for each of the mutually exclusive nodes */
  for (var state in this.list)
  {
										/* for short */
	var node = this.list[state].node;
										/* we have a dom node for this named state */
	if (node)
	{
										/* this is the state we want? */
	  if (state == want_state)
	  {
		//this.debug(F, "found wanted state \"" + want_state + "\" on node " + node.id);
		node.style.display = "block";
										/* also set inner html if caller provides it */
		if (options != undefined && 
		    options.inner_htmls != undefined)
		{
		  for(var subid in options.inner_htmls)
		  {
			var subnode = this.first_node_with_id(node, subid);
			if (subnode)
			{
			  subnode.innerHTML = options.inner_htmls[subid];
			}
		  }
		}

		this.list[state].showing = true;
	  }
										/* this is not the state we want?  */
	  else
	  {
		//this.debug(F, "found unwanted state \"" + state + "\" on node " + node.id);

		node.style.display = "none";

		this.list[state].showing = false;
	  }
	}
  }

  this.state = want_state;


} // end method


// --------------------------------------------------------------------
// watchfrog #46

dtack_dom_visibility_swapper_c.prototype.toggle_effect = function(want_state, options)
{
  var F = "toggle_effect";
  
  var node_ids = "";

  var nodes = new Array();
										/* for each of the mutually exclusive states */
  for (var state in this.list)
  {
	var node = this.list[state].node;

	if (false)
	$(node).position({
	  "my": "top left",
	  "at": "top left",
	  "of": "#central_table_panel_cell",
	  "offset": "0 0"
	  });

										/* this is the state we want? */
	if (state == want_state && !this.list[state].showing)
	{
	  nodes[nodes.length] = node;
	  node_ids += (node_ids != ""? ",": "") + "#" + node.id
	  this.list[state].showing = true;
	}
	else
	if (state != want_state && this.list[state].showing)
	{
	  nodes[nodes.length] = node;
	  node_ids += (node_ids != ""? ",": "") + "#" + node.id
	  this.list[state].showing = false;
	}
  }

  if (node_ids != "")
  {
	var effect = this.peek_attribute("toggle_effect");

	this.debug(F, "swapping (toggle) to state \"" + want_state + "\"" +
      " on " + node_ids +
      " using effect \"" + effect.name + "\"");

	if (effect.name == "basic")
	  $(nodes).slideToggle(
		effect.speed);
	else
	  $(nodes).toggle(
	    effect.name,
		effect.options,
		effect.speed);
  }

  this.state = want_state;


} // end method


// --------------------------------------------------------------------

dtack_dom_visibility_swapper_c.prototype.show_effect = function(want_state, options)
{
  var F = "show_effect";

  if (this.state == want_state)
    return;

  var show_effect = this.peek_attribute("show_effect");
  var hide_effect = this.peek_attribute("hide_effect");
  if (hide_effect == undefined)
    hide_effect = this.peek_attribute("show_effect");

  
										/* for each of the mutually exclusive nodes */
  for (var state in this.list)
  {
										/* for short */
	var node = this.list[state].node;
										/* we have a dom node for this named state */
	if (node)
	{
										/* this is the state we want? */
	  if (state == want_state)
	  {
										/* also set inner html if caller provides it */
		if (options != undefined && 
		    options.inner_htmls != undefined)
		{
		  for(var subid in options.inner_htmls)
		  {
			var subnode = this.first_node_with_id(node, subid);
			if (subnode)
			{
			  subnode.innerHTML = options.inner_htmls[subid];
			}
		  }
		}

		this.debug(F, "swapping in state \"" + want_state + "\"" +
		  " on " + this.node_description(node) +
		  " using effect \"" + (show_effect? show_effect.name: "style.display") + "\"");

		$(node).show(
		  show_effect.name,
		  show_effect.options,
		  show_effect.speed);

		this.list[state].showing = true;
	  }
										/* this is not the state we want?  */
	  else
	  {
		if (this.list[state].showing)
		{
		  this.list[state].showing = false;

		  this.debug(F, "swapping out state \"" + want_state + "\"" +
		    " on " + this.node_description(node) +
		    " using effect \"" + (hide_effect? hide_effect.name: "style.display") + "\"");

		  $(node).hide(
			hide_effect.name,
			hide_effect.options,
			hide_effect.speed);
		}
	  }
	}
  }

  this.state = want_state;


} // end method

