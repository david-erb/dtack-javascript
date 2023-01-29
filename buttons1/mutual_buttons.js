// --------------------------------------------------------------------
// class representing a list of elements, all of which have to be notified when any one is clicked

// wrap the prototyping in case the base class include files failed to arrive
try
{
										// inherit the base methods and variables
  dtack_mutual_buttons_c.prototype = new dtack_base2_c();
										/* remember who the base class is */
  dtack_mutual_buttons_c.prototype.parent = dtack_base2_c;
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

function dtack_mutual_buttons_c(dtack_environment, class_function)
{
  var F = "dtack_mutual_buttons_c";
										// initilialize the base instance variables
  this.construct(dtack_environment, F);

  this.class_function = class_function;

  this.list = new Array();
} // end constructor

// -------------------------------------------------------------------------------
// the opaque object is something specific to the button instance
// it is usually used by trigger handlers
// pass options through mutual button class to the buttons it adds
// watchfrog #112

dtack_mutual_buttons_c.prototype.add = function(container_node, opaque, options)
{
  var F = "add";
										/* make a new button object */
  var button = new this.class_function(this.dtack_environment);

  button.instance_debug_level = this.instance_debug_level;

  var that = this;
										/* who gets called when the button gets clicked */
  button.attach_trigger("clicked", function(button) {return that.hard_clicked(button);});

										/* put the button into the list */
  this.list.push(button);

										/* initialize the button, giving its serial number */
  button.initialize(container_node, this.list.length-1, opaque, options);

										/* return button so caller can attach more triggers */
  return button;

} // end method

// -------------------------------------------------------------------------------
// this can be called more than once to clear the list and repopulate it

dtack_mutual_buttons_c.prototype.initialize = function()
{
  var F = "initialize";

										/* just forget the list of buttons we had been using */
										/* someday: notify each button that it's being destructed */
  this.list = new Array();
} // end method

// -------------------------------------------------------------------------------
// this will remove the button nodes from the dom
// watchfrog #70

dtack_mutual_buttons_c.prototype.remove_buttons = function()
{
  var F = "remove_buttons";

  if (!this.list)
    return;
    
  for (var i=0; i<this.list.length; i++)
  {
										/* someday: notify each button that it's being destructed */
    var container_node = this.list[i].container_node;
    
    if (container_node)
    {
      container_node.parentNode.removeChild(container_node);
      
                                        // remove reference to help garbage collection
      this.list[i] = null;
    }
  }
                                        // remove reference to help garbage collection
  this.list.length = 0;
  this.list = null;
} // end method

// --------------------------------------------------------------------
// this is called when the manager should just arrange the button display

dtack_mutual_buttons_c.prototype.soft_clicked = function(button_manager_number)
{
  var F = "soft_clicked";
  
  //this.debug(F, "soft clicked number " + button_manager_number + " out of " + this.list.length);
  
  for (var i=0; i<this.list.length; i++)
  {
										/* this is the one that was clicked? */
	if (i == button_manager_number)
	{
										/* force down state */
	  this.list[i].soft_changed(2);
	}
										/* this is any other button in the list? */
	else
	{
                                        // this button is not inert?
                                        // watchfrog #61
	  if (this.list[i].state != 3)
	  {
										/* force non-hover, non-down */
	    this.list[i].soft_changed(0);
	  }
	}
  }

  return false;
} // end method

// --------------------------------------------------------------------
// this is called from the button  which was clicked

dtack_mutual_buttons_c.prototype.hard_clicked = function(button)
{
  var F = "hard_clicked";
  
  //this.debug(F, "hard clicked a button");

										/* first just arrange the button display */
  this.soft_clicked(button.manager_number);

										/* then notify all the triggers attached to us */
										/* give them the button that was clicked, not us (the manager) */
  this.pull_triggers("clicked", button);

} // end method

// --------------------------------------------------------------------
// called to reset all to the same state

dtack_mutual_buttons_c.prototype.set_all_to_state = function(state)
{
  var F = "set_all_to_state";
  
  for (var i=0; i<this.list.length; i++)
  {
	this.list[i].soft_changed(state);
  }
} // end method
