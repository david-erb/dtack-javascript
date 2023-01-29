// --------------------------------------------------------------------
// class representing a single clickable button 
// mouseover/mousedown states done by classing the background

// wrap the prototyping in case the base class include files failed to arrive
try
{
										// inherit the base methods and variables
  dtack_classing_button_c.prototype = new dtack_base2_c();
										/* remember who the base class is */
  dtack_classing_button_c.prototype.parent = dtack_base2_c;
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

function dtack_classing_button_c(dtack_environment)
{
  var F = "dtack_classing_button_c";
										// initilialize the base instance variables
  this.construct(dtack_environment, F);

  this.manager_number = 0;

  this.opaque = null;

  this.background_shift = "horizontal";
										/* initial state unknown */
  this.state = -1;

  this.classnames = new Array();

										/* constants which all buttons must implement */
  this.STATE_NORMAL = 0;
  this.STATE_HOVER = 1;
  this.STATE_ACTIVE = 2;
  this.STATE_INERT = 3;

} // end constructor

// -------------------------------------------------------------------------------
// initialize this button instance
// manager number is opaque to us, and used by the manager
// the opaque object is also opaque to us, and usually used by trigger handlers
// receive option which can tell what return value to use from hard click
// watchfrog #113

dtack_classing_button_c.prototype.initialize = function(container_node, manager_number, opaque, options)
{
  var F = "initialize";

  this.container_node = container_node;
  this.manager_number = manager_number;
  this.opaque = opaque;
  this.options = options;

                                        // let the option tell what return value to use from hard click
                                        // watchfrog #113
  if (this.options && this.options.return_from_hard_change != undefined)
    this.return_from_hard_change = this.options.return_from_hard_change == "true"? true: false;
  else 
  {
                                        // traditionally, the buttons return false from their onclick
                                        // this stops propagation which may hinder some onchange events to fire
                                        // probably any button could return true as long as it is not an <a> tag with an href
    this.return_from_hard_change = false;
  }

  this.debug_identifier = this.container_node.tagName;
  if (this.container_node.id && this.container_node.id != "")
    this.debug_identifier += "#" + this.container_node.id;
  this.debug_identifier += "." + manager_number;

  //if (this.instance_debug_level > 0)
  //  this.debug(F, "initialized" + 
  //    " with opaque " + this.object_to_string(opaque));

  var classname = container_node.className;

  if (classname == null)
  {
	this.debug(F, "className is null");
	return;
  }

  var pattern = new RegExp("^(.*)(_[^_]+)$");
  var parts = classname.match(pattern);

  if (!parts)
  {
	this.debug(F, "className \"" + classname + "\" does not match the pattern");
	return;
  }

  classname_base = parts[1];

  //this.debug(F, "classname " + classname + " parsed into " + parts.length + " parts" +
  //  " so classname_base is " + classname_base);
  
										/* names of the classes for each state */
  this.classnames[this.STATE_NORMAL] = classname_base + "_normal";
  this.classnames[this.STATE_HOVER] = classname_base + "_hover";
  this.classnames[this.STATE_ACTIVE] = classname_base + "_active";
  this.classnames[this.STATE_INERT] = classname_base + "_inert";

  var that = this;
  this.container_node.onmouseout = function() {return that.hard_changed(that.STATE_NORMAL);}
  this.container_node.onmouseover = function() {return that.hard_changed(that.STATE_HOVER);}
  this.container_node.onmousedown = function() {return that.hard_changed(that.STATE_ACTIVE);}

										/* set the initial state */
  this.soft_changed(this.STATE_NORMAL);

} // end method

// --------------------------------------------------------------------
// change the background state of the button but dont pull any triggers

dtack_classing_button_c.prototype.soft_changed = function(state)
{
  var F = "soft_changed";
  
										/* this is a real change of state? */
  if (state != this.state)
  {

	var position;

	this.container_node.className = this.classnames[state];


	//this.debug(F, "goes to state " + state + 
	//  " with className " + this.container_node.className);

	this.state = state;
  }

  return false;
} // end method

// --------------------------------------------------------------------
// change the background state of the button and pull all triggers

dtack_classing_button_c.prototype.hard_changed = function(state)
{
  var F = "hard_changed";

  //this.debug(F, "hard changing to state " + state);

										/* we are not inert (i.e. not immune to hard changes? */
  if (this.state != this.STATE_INERT)
  {

										/* let a second click on a down button cause an event */
										/* watchfrog #8 */
	if (this.state != this.STATE_ACTIVE)
	{
										/* redraw the buttons before notifying listeners */
	  this.soft_changed(state);
	}
	
	if (state == this.STATE_ACTIVE)
	{
	  if (this.instance_debug_level > 0)
		this.debug(F, "really clicked");
	  
										/* notify all the triggers listening on the click */
	  this.pull_triggers("clicked", this);
	}
  }
                                        // allow optional control of the value that we return from a real click
                                        // and nice enhancement might be to allow the triggers to override this
                                        // watchfrog #113
  return this.return_from_hard_change;
} // end method
