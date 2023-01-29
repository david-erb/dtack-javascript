/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  ! THIS FILE IS A COMPONENT OF THE DTACK_JAVASCRIPT LIBRARY
  ! THIS FILE IS TO BE TREATED WITH "TRADE SECRET" CARE
  ! Copyright (C) 2005 Dtack Inc. All Rights Reserved
  ! To use this file, you must have signed a license agreement with Dtack Inc.
  ! Under no circumstances may you redistribute this file.
  ! This software is provided AS IS with no warranty expressed or implied.
  ! Dtack Inc. accepts no liability for use or misuse of this file.
  ! http://www.dtack.com  dtack@dtack.com  telephone +360.670.5775
  ! Dtack Inc., 1009 Homestead Ave., Port Angeles, WA USA 98362
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */

// the dtack_base is a set of functions and variables which are common to all dtack_bezel17 objects
// it uses the dtack_environment object to interact with the operator

var dtack_base_instance_serial_number = 0;
// --------------------------------------------------------------------
// arguments are optional
// watchfrog #6

function dtack_base2_c(dtack_environment, classname)
{
  if (arguments.length > 0)
  {
	var F = "dtack_base2_c";

	this.construct(dtack_environment, classname);
                     
    this.push_class_hierarchy(F);

	//this.dtack_environment.debug(F, "finished constructor");
  }
}

// --------------------------------------------------------------------
// constructor helper: initilialize the base instance variables

dtack_base2_c.prototype.construct = function(dtack_environment, classname)
{
										/* operate within this environment */
  this.dtack_environment = dtack_environment;
										/* remember what class we are */
  this.classname = classname;
										/* array of event triggers */
  this.triggers = new Array();
										/* default instance identifier */
  this.debug_identifier = "~";
										/* object unique serial number */
  dtack_base_instance_serial_number++;
  this.instance_serial_number = dtack_base_instance_serial_number;

										/* watchfrog #49 */
  this.attributes = new Object();
  
  this.class_hierarchy_array = new Array();
  this.instance_owner_array = new Array();
  
  this.SELECTOR_DESCRIPTOR_KEYWORD = "dtack_selector_descriptor";
}


// -------------------------------------------------------------------------------
// chain class hierarchy instance identifiers to help with specific object debug filtering
// watchfrog #230

dtack_base2_c.prototype.push_class_hierarchy = function(class_name)
{
  this.class_hierarchy_array.push(class_name);
} // end method


// -------------------------------------------------------------------------------
// let the owner of this object identify its class hierarcy to this instance
// this is so this instance's verbose debug will be filtered with the owning hierarchy
// watchfrog #229

dtack_base2_c.prototype.push_instance_owners = function(class_hierarchy_array)
{
  var F = "dtack_base2_c::push_instance_owners";
  
  this.should_debug_verbose = undefined;
  
  for(var k in class_hierarchy_array)
  {
    this.instance_owner_array.push(class_hierarchy_array[k]);
  }
  
  //this.debug(F, "instance owners are now " + this.compose_instance_owner_string());
  
} // end method


// -------------------------------------------------------------------------------
// watchfrog #230

dtack_base2_c.prototype.compose_class_hierarcy_string = function()
{                                                         
  return this.class_hierarchy_array.reverse().join("->");
} // end method

// -------------------------------------------------------------------------------
// watchfrog #229

dtack_base2_c.prototype.compose_instance_owner_string = function()
{                                                         
  return this.instance_owner_array.join(", ");
} // end method

// --------------------------------------------------------------------
dtack_base2_c.prototype.okbox = function(F, message)
{
  this.dtack_environment.okbox(F, message);
} // end method

// -------------------------------------------------------------------
dtack_base2_c.prototype.error = function(F, message)
{
  this.dtack_environment.error(F, message);
} // end method

// -------------------------------------------------------------------
dtack_base2_c.prototype.state = function(message)
{
  this.dtack_environment.state(message);
} // end method

// -------------------------------------------------------------------

dtack_base2_c.prototype.debug = function(F, message)
{
                                       // filter out debug
                                       // watchfrog #106
  if (this.dtack_environment.settings.debug)
  {
    if (this.dtack_environment.settings.debug.excluded_methods &&
        this.dtack_environment.settings.debug.excluded_methods[F])
      return;
  }
  
                                       // filter out debug from host.js
//  var r = "";
//  if (!this.dtack_environment.settings.host)
//  {
//  	r = " (no settings)";
//  }
//  else
//  if (!this.dtack_environment.settings.host)
//  {
//  	r = " (no settings.host)";
//  }
//  else
//  if (!this.dtack_environment.settings.host["debug"])
//  {
//  	r = " (no settings.host[debug])";
//  }
//  else
//  if (!this.dtack_environment.settings.host["debug"].excluded_methods)
//  {
//  	r = " (no settings.host[debug].excluded_methods)";
//  }
//  else
//  if (!this.dtack_environment.settings.host["debug"].excluded_methods[F])
//  {
//  	r = " (no settings.host[debug].excluded_methods[" + F + "])";
//  }
//  else
//  {
//    return;
//  }

                                        // add debug exclusion in the host settings
                                        // watchfrog #157
  if (!this.dtack_environment.settings.host ||
      !this.dtack_environment.settings.host ||
      !this.dtack_environment.settings.host["debug"] ||
      !this.dtack_environment.settings.host["debug"].excluded_methods ||
      !this.dtack_environment.settings.host["debug"].excluded_methods[F])
  {
  }
  else
  {
    return;
  }

  this.dtack_environment.debug(
	this.classname +
	"#" + this.instance_serial_number +
    " (" + this.debug_identifier + ")" +
	"::" + F,
    message);
} // end method

// -------------------------------------------------------------------------------
// function to debug an event
// watchfrog #10

dtack_base2_c.prototype.debug_event = function(F, event_object)
{
  if (!event_object)
    var event_object = window.event;

  var tg = (window.event) ? event_object.srcElement : event_object.target;
  this.debug(F, "event " + event_object.type +
    " happened to to target " + tg.nodeName);
}

// -------------------------------------------------------------------------------

dtack_base2_c.prototype.debug_verbose_exception = function(F, exception, trying)
{
  if (exception)
  {
	var message;
	
	if (exception.name != undefined)
	  message = exception.name + ": " + exception.message;
	else
	  message = exception;

	this.debug(F, (trying? "trying " + trying + " got ": "") + "exception: " + message);
  }
}

// -------------------------------------------------------------------------------

dtack_base2_c.prototype.debug_verbose = function(F, message)
{
  if (this.should_debug_verbose === undefined)
  {
    for(var k in this.class_hierarchy_array)
    {
  	  var class_name = this.class_hierarchy_array[k];
      if (this.is_affirmative_option(this.dtack_environment.settings.host.debug_verbose, class_name))
      {
      	this.should_debug_verbose = "yes";
      	break;
	  }
	}
  
    if (this.should_debug_verbose === undefined)
    for(var k in this.instance_owner_array)
    {
  	  var class_name = this.instance_owner_array[k];
      if (this.is_affirmative_option(this.dtack_environment.settings.host.debug_verbose, class_name))
      {
      	this.should_debug_verbose = "yes";
      	break;
	  }
	}

    if (this.should_debug_verbose === undefined)
      this.should_debug_verbose = "no";
  }

  if (this.should_debug_verbose === "yes")
  {
    this.debug(F, message);
  }
} // end method


// -------------------------------------------------------------------
// watchfrog #93

dtack_base2_c.prototype.assert = function(message, truth)
{
  if (!truth)
    throw(message);

} // end method

// -------------------------------------------------------------------
dtack_base2_c.prototype.poke_inner_html = function(id, html)
{
										// rename of found_nodes array
										// watchfrog #35
  if (this.found_nodes == undefined)
  {
	this.found_nodes = new Array()
  }

  var node = this.found_nodes[id];
  if (node == undefined)
  {
	node = this.element(id);
	if (node)
	  this.found_nodes[id] = node;
  }

  if (node)
    node.innerHTML = html;

} // end method

// -------------------------------------------------------------------
// new method to poke style display
// watchfrog #34

dtack_base2_c.prototype.poke_style_display = function(id, style_display)
{
  if (this.found_nodes == undefined)
  {
	this.found_nodes = new Array()
  }

  var node = this.found_nodes[id];
  if (node == undefined)
  {
	node = this.element(id);
	if (node)
	  this.found_nodes[id] = node;
  }

  if (node)
    node.style.display = style_display;

} // end method

// -------------------------------------------------------------------------------
// watchfrog #159
dtack_base2_c.prototype.option_keys_text = function(
  options)
{
  var option_keys;
  
  var text = "";
  if (options === undefined)
    option_keys = "no options";
  else
  if (options === null)
    option_keys = "null options";
  else
  {
  	for(var option_key in options)
  	{
  	  if (option_key !== null &&
  	      this.trim(option_key) != "")
	  {
        text += (text == ""? "": ", ") + (option_key? option_key: this.vts(option_key));
	  }
	}
    text = "with options {" + text + "}";
  }
    
  return text;
} // end method

// -------------------------------------------------------------------------------

dtack_base2_c.prototype.option_value = function(
  options,
  option,
  default_value)
{
  return this.dtack_environment.option_value(options, option, default_value);
} // end method
                                                              
// -------------------------------------------------------------------------------

dtack_base2_c.prototype.is_affirmative_option = function(
  options,
  option)
{
  return this.dtack_environment.is_affirmative_option(options, option);
} // end method

// -------------------------------------------------------------------------------

dtack_base2_c.prototype.is_affirmative_value = function(
  options,
  option)
{
  return this.dtack_environment.is_affirmative_value(options, option);
} // end method

// -------------------------------------------------------------------------------

dtack_base2_c.prototype.option_section_value = function(
  options,
  section_name,
  option,
  default_value)
{
  return this.dtack_environment.option_section_value(options, section_name, option, default_value);
} // end method

// -------------------------------------------------------------------
dtack_base2_c.prototype.element = function(id)
{
  return this.dtack_environment.element(id);
} // end method

// -------------------------------------------------------------------
dtack_base2_c.prototype.want_element = function(F, id)
{
  return this.dtack_environment.want_element(F, id);
} // end method

// -------------------------------------------------------------------
// watchfrog #18
dtack_base2_c.prototype.want_element_with_tagname = function(F, id, tagname)
{
  return this.dtack_environment.want_element_with_tagname(F, id, tagname);
} // end method

// -------------------------------------------------------------------
// watchfrog #15
dtack_base2_c.prototype.need_element = function(F, id)
{
  return this.dtack_environment.need_element(F, id);
} // end method
              
// -------------------------------------------------------------------------------
// require single response to jquery selector
// throw exception if can't be found

dtack_base2_c.prototype.$require = function(selector)
{
  $jquery_selection = $(selector);
  
  if (selector === undefined)
    throw "undefined selector";
  
  if (selector === null)
    throw "null selector";
  
  if (selector === "")
    throw "blank selector";
  
  if ($jquery_selection.length == 0)
    throw "no matches for $(" + selector + ")";
    
  if ($jquery_selection.length > 1)
    throw "too many (" + $jquery_selection.length + ") matches for $(" + selector + ")";
    
  return $jquery_selection;
} // end method

// -------------------------------------------------------------------------------

dtack_base2_c.prototype.$select = function(selector_string, options)
{
  var F = "module_wap__office_admin__staff_page_utility_c::select";
  
  if (selector_string === undefined)
    throw "undefined selector";
  
  if (selector_string === null)
    throw "null selector";
  
  if (selector_string === "")
    throw "blank selector";

  var $jquery_object = $(selector_string);
  
  var minimum_count = parseInt(this.option_value("minimum_count", "1"));
  
  this.assert("found " + $jquery_object.length +
    " but needed at least " + minimum_count +
    " for selector " + this.vts(selector_string),
    isNaN(minimum_count) || $jquery_object.length >= minimum_count);
  
  var maximum_count = parseInt(this.option_value("maximum_count", "1"));
  
  this.assert("found " + $jquery_object.length +
    " but needed at most " + maximum_count +
    " for selector " + this.vts(selector_string),
    isNaN(maximum_count) || $jquery_object.length <= maximum_count);

  $jquery_object.data("selector_string", selector_string);
  
  return $jquery_object;
  
} // end function  

// -------------------------------------------------------------------
dtack_base2_c.prototype.formfield = function(id)
{
  return this.dtack_environment.formfield(id);
} // end method

// -------------------------------------------------------------------
dtack_base2_c.prototype.want_formfield = function(F, id)
{
  return this.dtack_environment.want_formfield(F, id);
} // end method

// --------------------------------------------------------------------
// search recursively for the first node in the given container with the given id
// case is not ignored
// if not found, return null
// watchfrog #19

dtack_base2_c.prototype.first_node_with_id = function(container, id)
{
  var F = "first_node_with_id";

  if (container.childNodes == undefined)
    return null;

  for (var i=0; i<container.childNodes.length; i++)
  {
	var node = container.childNodes[i];
	if (node.id != undefined &&
	    node.id == id)
	{
	  return node;
	}

	node = this.first_node_with_id(node, id);

	if (node)
	  return node;
  }

  return null;

} // end method

// --------------------------------------------------------------------
// return something which describes a DOM node

dtack_base2_c.prototype.node_description = function(node)
{
  if (node == undefined)
    return "<undefined>";

  var description = "";

  description = "<";

  if (node.tagName)
    description += node.tagName;
  else
    description += node.nodeName;

  if (description == "<INPUT")
    description += " " + node.type;

  if (node.id != undefined &&
	  node.id != "")
    description += " id=\"" + node.id + "\"";

										/* better description for nodes with names and hrefs */
										/* watchfrog #42 */
  if (node.name != undefined && node.name != "")
    description += " name=\"" + node.name + "\"";

  if (node.href != undefined && node.href != "")
    description += " href=\"" + node.href + "\"";

                                        // add value to a radio button description
                                        // watchfrog #94
  if (node.type != undefined && node.type == "radio")
    description += " value=\"" + node.value + "\"";

  description += ">";

  return description;

} // end method

// --------------------------------------------------------------------
// search recursively for the first node in the given container with the given id
// case is ignored
// if not found, make a debug statement and return null (no error)

dtack_base2_c.prototype.want_first_node_with_id = function(container, id)
{
  var F = "want_first_node_with_id";

  if (container.childNodes == undefined)
  {
	this.debug(F, this.node_description(container) + " is not a container");
	return null;
  }

  for (var i=0; i<container.childNodes.length; i++)
  {
	var node = container.childNodes[i];
	if (node.id != undefined &&
	    node.id == id)
	{
	  return node;
	}

	node = this.first_node_with_id(node, id);

	if (node)
	  return node;
  }

  this.debug(F, "container " + this.node_description(container) +
    " had no child with id " + id);

  return null;

} // end method


// --------------------------------------------------------------------
// search recursively for the all node in the given container with the given id
// case is ignored
// if not found, return empty array
// watchfrog #53

dtack_base2_c.prototype.all_nodes_with_id = function(container, id, returned)
{
  var F = "want_first_node_with_id";

  if (!returned)
    returned = new Array();

  if (container.childNodes != undefined)
  {
    for (var i=0; i<container.childNodes.length; i++)
    {
	  var node = container.childNodes[i];
	  if (node.id != undefined &&
	      node.id == id)
  	  {
	    returned.push(node);
	  }

	  this.all_nodes_with_id(node, id, returned);
    }
  }

  return returned;
} // end method

// --------------------------------------------------------------------
// search recursively for the first node in the given container with the given id
// case is ignored
// if not found, make a debug statement and return null (no error)

dtack_base2_c.prototype.want_first_node_with_id_old = function(container, id)
{
  var F = "want_first_node_with_id";

  if (container.childNodes == undefined)
  {
	this.debug(F, "node " + container.id + "<" + container.tagName + "> is not a container");
	return null;
  }

  for (var i=0; i<container.childNodes.length; i++)
  {
	var node = container.childNodes[i];
	if (node.id != undefined &&
	    node.id == id)
	{
	  return node;
	}

	node = this.first_node_with_id(node, id);

	if (node)
	  return node;
  }

  var container_id = container.id;
  if (container_id == undefined)
    container_id = container.nodeName;

  this.debug(F, "container " + container_id + "<" + container.tagName + "> had no child with id " + id);

  return null;

} // end method


// --------------------------------------------------------------------
// search for the first node in the given container with the given tagname
// case is ignored
// if not found, make a debug statement and return null (no error)

dtack_base2_c.prototype.want_first_node_with_tagname = function(container, tagname)
{
  var F = "want_first_node_with_tagname";
  tagname = tagname.toLowerCase();

  if (container.childNodes == undefined)
  {
	this.debug(F, "node " + container.id + "<" + container.tagName + "> is not a container");
	return null;
  }

  for (i=0; i<container.childNodes.length; i++)
  {
	var node = container.childNodes[i];
	if (node.tagName != undefined &&
	    node.tagName.toLowerCase() == tagname)
	{
	  return node;
	}
  }

  var container_id = container.id;
  if (container_id == undefined)
    container_id = container.nodeName;

  this.debug(F, "container " + container_id + " had no child with tag " + tagname);

  return null;

} // end method

// --------------------------------------------------------------------
// search for all the nodes with the given id, return in an array
// if not found, make a debug statement and just don't add anyting to the output array
// replace this here from whence it disappeared since rev 94
// watchfrog #36

dtack_base2_c.prototype.get_elements_by_id = function(container, id, array)
{
  var F = "get_elements_by_id";

  if (container.childNodes == undefined)
  {
	this.debug(F, "node " + container.id + "<" + container.tagName + "> is not a container");
  }
  else
  {
	var i;
	for (i=0; i<container.childNodes.length; i++)
	{
	  var node = container.childNodes[i];
	  if (node.id != undefined &&
	      node.id == id)
	  {
		array.push(node);
	  }
										/* the node is a container node? */
	  if (node.childNodes != undefined)
	  {
										/* recursive call to look for children of child */
	    this.get_elements_by_id(node, id, array)
	  }
	}
  }

} // end method

// --------------------------------------------------------------------
// remove all children of a node except the first

dtack_base2_c.prototype.remove_child_nodes = function(container, tagname, keep_up_to)
{
  var F = "remove_child_nodes";
  tagname = tagname.toLowerCase();

  if (container.childNodes == undefined)
  {
	this.debug(F, "node <" + container.tagName + " id=" + container.id + "> is not a container");
	return null;
  }

  var i;
  var n = 0;
  for (i=0; i<container.childNodes.length; i++)
  {
	var node = container.childNodes[i];
	if (node.tagName != undefined &&
        node.tagName.toLowerCase() == tagname)
	{
	  if (n > keep_up_to)
		break;
	  n++;
	}
  }

  var had = container.childNodes.length;
  n = i;
  for (i=container.childNodes.length-1; i>=n; i--)
  {
	var node = container.childNodes[i];
	if (node.tagName != undefined &&
        node.tagName.toLowerCase() == tagname)
	{
	  container.removeChild(node);
	}
  }

  if (this.instance_debug_level > 0)
    this.debug(F, "node " + container.id + "<" + container.tagName + ">" +
      " had " + had + " child nodes and now has " + container.childNodes.length);

  return null;

} // end method


// --------------------------------------------------------------------

dtack_base2_c.prototype.debug_node_properties = function(F, node)
{
										// this list can be really long
  for (var property in node)
    this.debug(F, property + ": " + node[property]);

} // end method

// --------------------------------------------------------------------
// make debug statements regarding the state of the given container

dtack_base2_c.prototype.debug_container = function(F, container)
{
  this.debug(F, container.nodeName + " id " + container.id + " has " + container.childNodes.length + " children");

  var i;

  for (i=0; i<container.childNodes.length; i++)
  {
	var node = container.childNodes[i];
	this.debug(
	  F,
	  i + ". " + node.nodeName + " (tagName " + node.tagName + ")" +
	  " " + (node.hasChildNodes? " has " + node.childNodes.length + " children": "has no children"));
  }

} // end method

// --------------------------------------------------------------------
// add someone who wants to listen on an event that may happen to us
// event_type is any string that identifies the event
// trigger is a function
// return a trigger handle that can be used when detaching

dtack_base2_c.prototype.attach_trigger = function(event_type, trigger)
{
										/* there are not yet any attached triggers of this event type? */
  if (!this.triggers[event_type])
  {
										/* start an array to hold them */
	this.triggers[event_type] = new Array();
  }
  
  var t = new Object();
  t.trigger = trigger;
  
                                        // allow caller to provide a method name as an alternative to a trigger function
                                        // watchfrog #202
  if (trigger instanceof Function)
  {
  	t.trigger_is_function = true;
  }
  

										/* add the trigger function to the list for this event */
  var n = this.triggers[event_type].push(t);

                                        // return something to facilitate detaching this trigger
                                        // watchfrog #69
  return n - 1;

} // end method

// --------------------------------------------------------------------
// detach a previously attached trigger
// watchfrog #69

dtack_base2_c.prototype.detach_trigger = function(event_type, trigger_handle)
{
										/* there are any attached triggers of this event type? */
  if (this.triggers[event_type])
  {
  	if (trigger_handle != undefined &&
  	    trigger_handle >= 0 &&
  	    trigger_handle < this.triggers[event_type].length)
  	{
  		// note this method of detaching leaves a hole in the array
  		// this is a memory leak
  		                                // if detaching is to be done thousands of times, a better algorithm should be used
  	  this.triggers[event_type][trigger_handle] = undefined;
    }
  }

} // end method

// --------------------------------------------------------------------
// notify all the triggers of the event which just happened

dtack_base2_c.prototype.pull_triggers = function(event_type, object)
{
  var F = "pull_triggers";

										/* there are any attached triggers of this event type? */
  if (this.triggers[event_type])
  {
	if (this.instance_debug_level > 0)
	  this.debug(F, this.triggers[event_type].length + " trigger(s) to pull of type " + event_type);

										/* loop through all the attached triggers */
	for (var i=0; i<this.triggers[event_type].length; i++)
	{
                                        // trigger has not been detached?
                                        // watchfrog #69
	  if (this.triggers[event_type][i] != undefined)
	  {
	      
	    var trigger = this.triggers[event_type][i].trigger;
	    var trigger_is_function = this.triggers[event_type][i].trigger_is_function;

        if (this.instance_debug_level > 0)
	      this.debug(F, "pulling trigger " + event_type + "[" + i + "]" +
	        " trigger_is_function " + trigger_is_function +
	        " object is " + this.vts(object));
	    
	    if (trigger_is_function)
	    {
										/* call the trigger function */
	      trigger(object);
		}
                                        // allow caller to provide a method name as an alternative to a trigger function
                                        // watchfrog #202
		else
		{
		  // this.debug(F, "trigger with object " + this.option_keys_text(object))
		  eval("this." + trigger + "(object);");
		}
	  }
	}
  }
  else
  {
	if (this.instance_debug_level > 0)
	  this.debug(F, "no triggers to pull of type " + event_type);
  }

} // end method
// --------------------------------------------------------------------
// watchfrog #20

dtack_base2_c.prototype.clone_first_node_with_tagname = function(container_node, tagname)
{
  var F = "clone_node";

  var model_node = this.want_first_node_with_tagname(
	container_node, tagname);

  if (model_node)
  {
										// we never let the first one show, it is merely the template
	model_node.style.display = "none";

										/* make a new item in the list */
	var clone_node = document.createElement("li");

										/* inherit some attributes from the model we cloned */
	clone_node.id = model_node.id;
	clone_node.className = model_node.className;

										/* let the new item have contents just like the template */
	clone_node.innerHTML = model_node.innerHTML;

										/* place the new item in the parent displaylist */
	container_node.appendChild(clone_node);

										// let the new node display
	clone_node.style.display = "block";

  }

  return clone_node;
} // end method


// --------------------------------------------------------------------

dtack_base2_c.prototype.clone_node = function(model_node)
{
  var F = "clone_node";

  if (model_node)
  {
										// we never let the first one show, it is merely the template
	model_node.style.display = "none";

										/* make a new item in the list */
	var clone_node = document.createElement(model_node.tagName);

										/* inherit some attributes from the model we cloned */
	clone_node.id = model_node.id;
	clone_node.className = model_node.className;

										/* let the new item have contents just like the template */
	clone_node.innerHTML = model_node.innerHTML;

										/* place the new item in the parent displaylist */
	model_node.parentNode.appendChild(clone_node);

										// let the new node display
	clone_node.style.display = "block";

  }

  return clone_node;
} // end method

// --------------------------------------------------------------------
dtack_base2_c.prototype.object_to_string = function(object)
{
  var F = "object_to_string";

  var s;
  if (object == undefined)
    s = "undefined";
  else
  if (object == null)
    s = "null";
  else
  {
    s = object.toString();

	if (s.substr(0, 7) == "[object")
	{
	  for (var k in object)
	  {
		s = k + " " + this.object_to_string(object[k]);
		break;
	  }
	}
  }

  return s;
} // end method


// --------------------------------------------------------------------
dtack_base2_c.prototype.vts = function(value)
{
  return this.value_to_string(value);
} // end method


// --------------------------------------------------------------------
dtack_base2_c.prototype.value_to_string = function(value)
{
  var F = "value_to_string";

  var s;
  if (value === undefined)
    s = "undefined";
  else
  if (value === null)
    s = "null";
  else
  if (value === "")
    s = "{blank}";
  else
  if (value === false)
    s = "FALSE";
  else
  if (value === true)
    s = "TRUE";
  else
    s = "\"" + value + "\"";

  return s;
} // end method


// --------------------------------------------------------------------
// define a new css stylesheet rule

dtack_base2_c.prototype.add_stylesheet_rule = function(selector, definition)
{
  var F = "add_stylesheet_rule";

  var stylesheet = document.styleSheets[document.styleSheets.length-1];
  var rules = stylesheet.cssRules;

										/* this is the FF way */
  if (rules != undefined)
  {

	  //this.debug(F, "there are " + document.styleSheets.length + " stylesheets" +
	  //  " and " + (rules? rules.length: "no") + " rules");

	stylesheet.insertRule(selector + " {" + definition + "}", rules.length);
  }
										/* this is the IE way */
  else
  {
	stylesheet.addRule(selector, definition);

  }

} // end method

// --------------------------------------------------------------------
// all the php ajax replies need to satisfy this function

dtack_base2_c.prototype.ajax_standard_php_callback = function(ajax)
{
  var F = "ajax_standard_php_callback";

  var content_type = ajax.xhttp.getResponseHeader("Content-Type");

  //this.debug(F,"content-type returned is: " + content_type);

  var ok = true;
  try
  {
										/* check for standard errors inside the returned ajax response */
	ajax.check_response_errors();
	//this.debug(F, "response (text) was:\n" + ajax.xhttp.responseText);

  }
  catch(exception)
  {
	var message;
	if (exception.name != undefined)
	  message = exception.name + ": " + exception.message;
	else
	  message = exception;

	this.debug(F, "ajax.check_response_errors gave exception: " + message);

										// assign a message that can be retrieved by the caller
	// watchfrog #
	ajax.message = message;

	//this.debug(F, "stack trace:\n" + exception.stack);

	this.debug(F, "response (text) was:\n" + ajax.xhttp.responseText);

	ok = false;
  }
  finally
  {
										/* tell ajax we are finished with this conversation */
	ajax.finished();
  }

  return ok;

} // end method

// --------------------------------------------------------------------
// override all the properties in definition object or string

dtack_base2_c.prototype.properties_override_from = function(definition_object_or_data)
{
  var F = "properties_override_from";

  var definition_object;

  if (String.prototype.isPrototypeOf(definition_object_or_data))
  {
	definition_object = new Object();
	if (definition_data != "")
	{
	  eval("definition_object = {" + definition_data + "};");
	}
  }
  else
  {
	definition_object = definition_object_or_data;
  }


  for(var attribute_name in definition_object)
  {
	this[attribute_name] = definition_object[attribute_name];
	//this.debug(F,  attribute_name + " is " + this[attribute_name]);
  }
} // end method

// -----------------------------------------------------------------------------------
// watchfrog #107

dtack_base2_c.prototype.parse_standard_or_sql_dateonly = function(value, options)
{
  var F = "parse_standard_or_sql_dateonly";

  var date;

  date = this.parse_standard_dateonly(value, options);

  if (date)
    return date;

  date = this.parse_sql_dateonly(value, options);

  return date;

} // end method

// -----------------------------------------------------------------------------------
// watchfrog #107

dtack_base2_c.prototype.parse_sql_or_standard_dateonly = function(value, options)
{
  var F = "parse_sql_or_standard_dateonly";

  var date;

  date = this.parse_sql_dateonly(value, options);

  if (date)
    return date;

  date = this.parse_standard_dateonly(value, options);

  return date;

} // end method

// -----------------------------------------------------------------------------------
// watchfrog #84

dtack_base2_c.prototype.parse_standard_dateonly = function(value, options)
{
  var F = "parse_standard_dateonly";

  var date = undefined;

                                        // guard against undefined date value
                                        // watchfrog #74
  if (value == undefined)
    return date;

                                        // check for some standard date strings
                                        // watchfrog #125
  var today = new Date();

  if (value == "today")
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());

  if (value == "yesterday")
    return new Date(today.getFullYear(), today.getMonth(), today.getDate()-1);

  if (value == "tomorrow")
    return new Date(today.getFullYear(), today.getMonth(), today.getDate()+1);

  var splits = value.split(" ");

  var ignore_time_part = options && options.ignore_time_part;

                                        // options say to ignore time part?
                                        // watchfrog #108
  if (splits.length != 1 && !ignore_time_part)
    return date;

  splits = splits[0].split("/");

  if (splits.length == 3)
  {
    var year = splits[2].replace(/^0/, "");

	if (!year.match(/[0-9]+/))
	  return date;

    if (year.length > 4)
      return date;

    year = parseInt(year);
    if (isNaN(year))
      return date;

	if (year < 100)
	  year += 2000;

	var month = splits[0].replace(/^0/, "");

    if (!month.match(/[0-9]+/))
      return date;

    if (month.length > 2)
      return date;

    month = parseInt(month);
    if (isNaN(month))
      return date;

	var day = splits[1].replace(/^0/, "");

    if (!day.match(/[0-9]+/))
      return date;

    if (day.length > 2)
      return date;

	if (isNaN(day))
	  return date;

	  this.debug(F, "split \"" + value + "\" had length " + splits.length +
	    " [" + year + "]" +
	    " [" + month + "]" +
	    " [" + day + "]");

	date = new Date(year, month-1, day);
  }

  return date;

} // end method

// -----------------------------------------------------------------------------------

dtack_base2_c.prototype.parse_sql_dateonly = function(value, options)
{
  var F = "parse_sql_dateonly";

  var date = undefined;

                                        // guard against undefined date value
                                        // watchfrog #74
  if (value == undefined)
    return date;
                                        // always ignore the time part
  var splits = value.split(" ");
  splits = splits[0].split("-");

  if (splits.length == 3)
  {
	var year = parseInt(splits[0]);
	var month = parseInt(splits[1].replace(/^0/, ""));
	var day = parseInt(splits[2].replace(/^0/, ""));

	//this.debug(F, "split \"" + value + "\" had length " + splits.length +
	//  " [" + year + "]" +
	//  " [" + month + "]" +
	//  " [" + day + "]");

	date = new Date(year, month-1, day);
  }

  return date;

} // end method

// -----------------------------------------------------------------------------------
// watchfrog #44

dtack_base2_c.prototype.parse_sql_datetime = function(value)
{
  var F = "parse_sql_datetime";

  var date = this.parse_sql_dateonly(value);

  if (date != undefined)
  {
	var splits = value.split(" ");

	if (splits.length > 1)
	{
	  splits = splits[1].split(":");

	  if (splits.length == 3)
	  {
		var hour = parseInt(splits[0].replace(/^0/, ""));
		var minute = parseInt(splits[1].replace(/^0/, ""));
		var second = parseInt(splits[2].replace(/^0/, ""));

		//this.debug(F, "split \"" + value + "\" had length " + splits.length +
		//  " [" + year + "]" +
		//  " [" + month + "]" +
		//  " [" + day + "]");

		date.setHours(hour, minute, second);
	  }
	}
  }

  return date;

} // end method

// -----------------------------------------------------------------------------------

dtack_base2_c.prototype.is_valid_time = function(value, result)
{
  var F = "is_valid_time";
  
  if (!result)
    result = new Object();
    
  value = this.trim(value);
  splits = value.split(":");

  if (splits.length > 2)
  {
  	result.reason = "too many colons";
    return false;
  }

  if (splits.length < 2)
  {
  	result.reason = "missing colon";
    return false;
  }

  var regexp1 = /^[0-9]?[0-9]$/;
  
  if (!splits[0].match(regexp1))
  {
  	result.reason = "hour part has extra and/or invalid characters";
    return false;
  }
  
  var regexp2 = /^[0-9][0-9]$/;
  
  if (!splits[1].match(regexp2))
  {
  	result.reason = "minute part has extra and/or invalid characters";
    return false;
  }
    
  var hour = parseInt(splits[0].replace(/^0/, ""));
  var minute = parseInt(splits[1].replace(/^0/, ""));
  
  if (hour < 0 || hour > 12)
  {
  	result.reason = "hour part more than 12";
    return false;
  }
    
  if (minute < 0 || minute > 59)
  {
  	result.reason = "minute part more than 59";
    return false;
  }

  return true;

} // end method

// -----------------------------------------------------------------------------------
// same function different name

dtack_base2_c.prototype.date_format = function(date, options)
{
   return this.format_date(date, options);
} // end method

// -----------------------------------------------------------------------------------

dtack_base2_c.prototype.format_date = function(date, options)
{
  if (date == undefined)
    date = new Date();

  var month = date.getMonth() + 1;

  var day = date.getDate();

  var hours = date.getHours();
  if (hours < 10)
    hours = "0" + hours;

  var minutes = date.getMinutes();
  if (minutes < 10)
    minutes = "0" + minutes;

  var seconds = date.getSeconds();
  if (seconds < 10)
    seconds = "0" + seconds;

  var milliseconds = "";
  if (options && options.include_milliseconds == "yes")
  {
	milliseconds = date.getMilliseconds();
	if (milliseconds < 10)
	  milliseconds = "00" + milliseconds;
	else
	if (milliseconds < 100)
	  milliseconds = "0" + milliseconds;

	milliseconds = "." + milliseconds;
  }

  var timezone = "";
  if (options && options.include_timezone == "yes")
  {
	timezone = " [" + date.getTimezoneOffset() + "]";
  }

  var s;

  if (options && options.format == "american date and time")
  {
    s = this.format_date(date, {"format": "american date only"}) +
      " " +
      this.format_date(date, {"format": "nice time of day"});
  }
  else

  if (options && options.format == "american date only")
  {
    s = month + "/" +
      day + "/" +
      date.getFullYear();
  }
  else
										// watchfrog #23
  if (options && options.format == "mysql date only")
  {
	if (month < 10)
	  month = "0" + month;

	if (day < 10)
	  day = "0" + day;

	s = date.getFullYear() + "-" +
      month + "-" +
	  day;
  }
  else
										// watchfrog #23
  if (options && options.format == "nice time of day")
  {
  	var am = "am";
  	                                    // put base in parse to remove leading 0 in time of day
                                        // watchfrog #111
  	hours = parseInt(hours, 10);
  	if (hours == 12)
  	{
  	  am = "pm";
  	}
  	else
  	if (hours > 12)
  	{
  	  am = "pm";
  	  hours -= 12;
  	}


	s =
      hours + ":" +
      minutes + milliseconds + " " +
      am;
  }
  else
  {
	if (month < 10)
	  month = "0" + month;

	if (day < 10)
	  day = "0" + day;
  	
	s = date.getFullYear() + "-" +
      month + "-" +
      day + " " +
      hours + ":" +
      minutes + ":" +
      seconds + 
      milliseconds +
      timezone;
  }

  return s;
} // end method

// -------------------------------------------------------------------------------
// watchfrog #41
dtack_base2_c.prototype.event_target_node = function(event_object)
{
  if (!event_object)
    event_object = window.event;

  var node = event_object.target || event_object.srcElement;

  return node;
} // end method


// -----------------------------------------------------------------------------------
// timer functions
// watchfrog #43
// to fire just once after short delay
// {
//   "period": "100",
//   "maximum_repetitions": "1",
//   "immediate": "no",
//   "opaque": "something"
// }

dtack_base2_c.prototype.timer_start = function(event_name, options)
{
  var F = "timer_start";

  if (this.timer_objects == undefined)
  {
	this.timer_objects = new Object();
  }
										/* we already have this timer? */
  if (this.timer_objects[event_name] != undefined)
  {
										/* cease its firing */
	this.timer_cease(event_name);
  }

  if (options == undefined)
    options = new Object();

  var timer_object = {
	"event_name": event_name,
	"options": options,
	"timer": undefined,
	"repetitions": 0
  }

  var period = timer_object["options"]["period"];
  if (period == undefined)
    period = 1000;

  timer_object.maximum_repetitions = timer_object["options"]["maximum_repetitions"];
  if (timer_object.maximum_repetitions == undefined)
    timer_object.maximum_repetitions = -1;

										/* allow more than one timer to run concurrently */
  this.timer_objects[event_name] = timer_object;

										/* light this timer off immediately */
  if (timer_object["options"]["immediate"] != "no")
    this.timer_event(event_name);

  var that = this;
										/* set a timer to call it again after the period */
  timer_object.timer = setInterval(
	function()
	{
	  that.timer_event(timer_object.event_name);
	},
	period);

    // don't put debug in this routine because maybe we're calling
    // it because we want a new thread and debug on the old thread might interfere
//  this.debug(F, "starting timer on " + event_name +
//    " for maximum repetitions " + timer_object.maximum_repetitions);

} // end method

// -----------------------------------------------------------------------------------

dtack_base2_c.prototype.timer_cease = function(event_name)
{
  var F = "timer_cease";

  if (this.timer_objects == undefined)
    return;

  var timer_object = this.timer_objects[event_name];

  if (timer_object == undefined)
	return;
										/* timer has been shut off? */
  if (timer_object.timer == undefined)
	return;

  clearInterval(timer_object.timer);

  timer_object.timer = undefined;

} // end method

// -----------------------------------------------------------------------------------

dtack_base2_c.prototype.timer_event = function(event_name)
{
  var F = "timer_event";

  if (this.timer_objects == undefined)
	return;

  var timer_object = this.timer_objects[event_name];

  if (timer_object == undefined)
	return;
										/* timer has been shut off? */
  if (timer_object.timer == undefined)
	return;

  if (timer_object.maximum_repetitions != -1 &&
      timer_object.repetitions >= timer_object.maximum_repetitions)
  {
	this.timer_cease(event_name);
	return;
  }

  timer_object.repetitions++;

										/* put the event trigger */
                                        // if caller gave options.opaque, return that in the event trigger
                                        // otherwise return "this" for backwards compatability
                                        // watchfrog #114
  this.pull_triggers(event_name, timer_object.options.opaque != undefined? timer_object.options.opaque: this);

} // end method

// -----------------------------------------------------------------------------------
// returns the class name of the argument or undefined if not a valid JavaScript object
// watchfrog #48

dtack_base2_c.prototype.classname_of_object = function(object)
{
  var F = "classname_of_object";

  if (object &&
      object.constructor &&
      object.constructor.toString)
  {
	var a = object.constructor.toString().match(/function\s*(\w+)/);
	if (a && a.length == 2)
	{
	  return a[1];
	}
  }

  return undefined;

} // end method

// -----------------------------------------------------------------------------------
// watchfrog #49

dtack_base2_c.prototype.poke_attributes = function(attributes)
{
  var F = "poke_attributes";

  this.attributes = new Object();

  if (attributes != undefined)
  {
	for (var name in attributes)
	  this.attributes[name] = attributes[name];
  }

} // end method

// -----------------------------------------------------------------------------------
// watchfrog #49

dtack_base2_c.prototype.poke_attribute = function(name, value)
{
  var F = "poke_attribute";

  this.attributes[name] = value;

} // end method

// -----------------------------------------------------------------------------------

dtack_base2_c.prototype.peek_attribute = function(name, deefault)
{
  var F = "peek_attribute";

  if (this.attributes[name] == undefined)
    return deefault;
  else
    return this.attributes[name];

} // end method

// -------------------------------------------------------------------------------

dtack_base2_c.prototype.absolute_coordinates = function(element)
{
  var r = { x: element.offsetLeft, y: element.offsetTop };

  if (element.offsetParent)
  {
	var tmp = this.absolute_coordinates(element.offsetParent);
	r.x += tmp.x;
	r.y += tmp.y;
  }

  return r;

} // end method

// -------------------------------------------------------------------------------
// got this from http://eriwen.com/javascript/js-stack-trace/
// never really got it to work at least on FF

dtack_base2_c.prototype.stack_trace = function()
{
  var callstack = [];
  var isCallstackPopulated = false;
  try {
    i.dont.exist+=0; //doesn't exist- that's the point
  } catch(e) {
    if (e.stack) { //Firefox
      var lines = e.stack.split('\n');
      for (var i=0, len=lines.length; i<len; i++) {
        if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
          callstack.push(lines[i]);
        }
      }
      //Remove call to printStackTrace()
      callstack.shift();
      isCallstackPopulated = true;
    }
    else if (window.opera && e.message) { //Opera
      var lines = e.message.split('\n');
      for (var i=0, len=lines.length; i<len; i++) {
        if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
          var entry = lines[i];
          //Append next line also since it has the file info
          if (lines[i+1]) {
            entry += " at " + lines[i+1];
            i++;
          }
          callstack.push(entry);
        }
      }
      //Remove call to printStackTrace()
      callstack.shift();
      isCallstackPopulated = true;
    }
  }
  if (!isCallstackPopulated) { //IE and Safari
    var currentFunction = arguments.callee.caller;
    while (currentFunction) {
      var fn = currentFunction.toString();
      var fname = fn.substring(fn.indexOf("function") + 8, fn.indexOf('')) || 'anonymous';
      callstack.push(fname);
      currentFunction = currentFunction.caller;
    }
  }
  return callstack;

} // end method

// -------------------------------------------------------------------------------
// watchfrog #56

dtack_base2_c.prototype.debug_stack_trace = function(F)
{
  var stack_trace = this.stack_trace();

  this.debug(F, "stack trace: (" + stack_trace.length + " lines)\n" + stack_trace.join("\n"));
  //for (var i=0; i<stack_trace.length; i++)
 // {
   // this.debug(F, "----" + stack_trace[i]);
  //}

} // end method

// -------------------------------------------------------------------------------
// watchfrog #138

dtack_base2_c.prototype.enter_method = function(F, parameters)
{
  var parameters_string = "";

  if (parameters != undefined)
  {
    for (var parameter in parameters)
    {
      if (parameters_string == "")
        parameters_string = "(" + parameter;
      else
        parameters_string += ", " + parameter;

      parameters_string += " = \"" + parameters[parameter] + "\"";
    }

    if (parameters_string != "")
      parameters_string += ")";
  }

  this.debug("enter", "enter method " + F + parameters_string);

  return F;
} // end method

// -------------------------------------------------------------------------------
// watchfrog #138

dtack_base2_c.prototype.leave_method = function(F, value)
{
  var return_string = "";

  if (value != undefined)
    return_string = " returning \"" + value + "\"";

  this.debug("leave", "leave method " + F + return_string);

  return value;
} // end method

  // ------------------------------------------------------------------
  // watchfrog #141

dtack_base2_c.prototype.host_value = function(dotted_keyword, default_value)
{
  return this.dtack_environment.host_value(dotted_keyword, default_value);
} // end method
      
  // ------------------------------------------------------------------
  // watchfrog #141

dtack_base2_c.prototype.host_require = function(dotted_keyword)
{
  return this.dtack_environment.host_require(dotted_keyword);
} // end method

  // ------------------------------------------------------------------
  // watchfrog #141

dtack_base2_c.prototype.host_set = function(dotted_keyword, value)
{
  this.dtack_environment.host_set(dotted_keyword, value);
} // end method

  // ------------------------------------------------------------------
  // watchfrog #144

  dtack_base2_c.prototype.pfill = function(id)
  {
  	var F = "pfill";
  	
  	var element = this.need_element(F, id);
  	
  	if (element == null)
  	  return;
  	  
    //alert(element.name + " tagName is " + element.tagName + " type " + element.type + " of className " + element.className);
  	
  	if (element.tagName == "INPUT" && 
  	    element.type == "radio")
  	{
  	  element.checked = true;
	}
	else
  	if (element.tagName == "INPUT" ||
  	    element.tagName == "TEXTAREA")
  	{
      var options = {"include_milliseconds": "yes"};
	  
      var datetime = this.date_format(new Date(), options);
  	  var timestamp = datetime.replace(/[.: -]/g, "");
  	  if (element.className.match(/dtproperty_dateonly/))
  	  {
  	  	element.value = this.date_format(new Date(), {"format": "mysql date only"});
	  }
	  else
  	  if (element.className.match(/dtproperty_integer/))
  	  {
  	  	element.value = timestamp.substring(timestamp.length-2);
	  }
	  else
  	  if (element.className.match(/dtproperty_float/))
  	  {
  	  	element.value = timestamp.substring(timestamp.length-3, timestamp.length-1) + "." + timestamp.substring(timestamp.length-1);
	  }
	  else
  	  if (element.className.match(/dtproperty_phone/))
  	  {
  	  	var phone;
  	  	phone = timestamp.substring(timestamp.length-10, timestamp.length-7);
  	  	phone = phone + "-" + timestamp.substring(timestamp.length-7, timestamp.length-4);
  	  	phone = phone + "-" + timestamp.substring(timestamp.length-4);
  	  	element.value = phone;
	  }
	  else
  	  if (element.className.match(/dtproperty_email/))
	  {
  	  	element.value = timestamp.substring(timestamp.length-10) + "@dtack.com";
	  }
	  else
	  {
        element.value = element.name + " " + datetime;
	  }
	}
	else
  	if (element.tagName == "SELECT")
	{
	  if (element.options.length == 1)
	    element.selectedIndex = 0;
	  else
	  if (element.options.length > 1)
	  {
	  	if (element.options[0].text != "")
  	      element.selectedIndex = 0;
  	    else
  	      element.selectedIndex = 1;
	  }
	}
	
	return false;
  } // end method


  // ------------------------------------------------------------------
  // watchfrog #144

  dtack_base2_c.prototype.pfill_all = function()
  {
  	var F = "pfill_all";
  	
  	for(var id in dtcomposer_pfill_array)
  	{
  	  this.pfill(id);
	}
	
	return false;
  } // end method


  // -------------------------------------------------------------------------------
  dtack_base2_c.prototype.define_symbol = function(symbol_name, symbol_value)
  {
  	this.dtack_environment.define_symbol(symbol_name, symbol_value);
  } // end method

  // -------------------------------------------------------------------------------
  dtack_base2_c.prototype.resolve_symbol = function(symbol_name, default_symbol_value)
  {
  	return this.dtack_environment.resolve_symbol(symbol_name, default_symbol_value);
  } // end method

  // -------------------------------------------------------------------------------
  dtack_base2_c.prototype.require_symbol = function(symbol_name)
  {
  	return this.dtack_environment.require_symbol(symbol_name);
  } // end method
  

  // -------------------------------------------------------------------------------
  dtack_base2_c.prototype.require_nonblank_symbol = function(symbol_name)
  {
  	return this.dtack_environment.require_nonblank_symbol(symbol_name);
  } // end method
 

  // -------------------------------------------------------------------------------
  dtack_base2_c.prototype.trim = function(string)
  {
  	return this.dtack_environment.trim(string);
  } // end method

  // -------------------------------------------------------------------------------
  dtack_base2_c.prototype.starts_with = function(string, prefix)
  {
  	return this.dtack_environment.starts_with(string, prefix);
  } // end method
  // -------------------------------------------------------------------------------
  dtack_base2_c.prototype.ends_with = function(string, suffix)
  {
  	return this.dtack_environment.ends_with(string, suffix);
  } // end method
 
  // -------------------------------------------------------------------------------
  dtack_base2_c.prototype.escape_xml = function(string)
  {
  	return this.dtack_environment.escape_xml(string);
  } // end method
 
 
// -------------------------------------------------------------------------------
// watchfrog #172

dtack_base2_c.prototype.extract_id_parts = function(id)
{
   var regexp = /(.+)\[(.+)\]$/,g;
   
   var parts_array = regexp.exec(id);
   
   if (parts_array == null)
   {
     var parts = {
       "table_name": "",
   	   "autoid": ""
     };
   }
   else
   {
     var parts = {
       "table_name": parts_array[1],
   	   "autoid": parts_array[2]
     };
   }

//  	  	alert("clicked target id \"" + id + "\"\n" +
//  	  	  " table_name \"" + parts.table_name + "\"\n" +
//  	  	  " autoid \"" + parts.autoid + "\"");
   
   return parts;
}

// -------------------------------------------------------------------------------

dtack_base2_c.prototype.extract_table_and_field_parts = function(id)
{
   var regexp = /(.+)\[(.+)\]$/,g;
   
   var parts_array = regexp.exec(id);
   
   if (parts_array == null)
   {
     var parts = {
       "table_name": "",
   	   "field_name": ""
     };
   }
   else
   {
     var parts = {
       "table_name": parts_array[1],
   	   "field_name": parts_array[2]
     };
   }

//  	  	alert("clicked target id \"" + id + "\"\n" +
//  	  	  " table_name \"" + parts.table_name + "\"\n" +
//  	  	  " autoid \"" + parts.autoid + "\"");
   
   return parts;
}

// -------------------------------------------------------------------------------
dtack_base2_c.prototype.extract_id_and_field_parts = function(id)
{
   var regexp = /(.+)\[(.+)\]\[(.+)\]$/,g;
   
   var parts_array = regexp.exec(id);
   
   if (parts_array == null)
   {
     var parts = {
       "table_name": this.default_extracted_table_name,
   	   "autoid": this.default_extracted_autoid,
       "field_name": id
     };
   }
   else
   {
     var parts = {
       "table_name": parts_array[1],
   	   "autoid": parts_array[2],
       "field_name": parts_array[3]
     };
   }

//  	  	alert("target id \"" + id + "\"\n" +
//  	  	  " table_name \"" + parts.table_name + "\"\n" +
//  	  	  " autoid \"" + parts.autoid + "\"\n" +
//  	  	  " field_name \"" + parts.field_name + "\"");
   
   return parts;
} // end method

// -------------------------------------------------------------------------------

dtack_base2_c.prototype.warn_about_configuration = function(F, message)
{
  alert(F + ": " + message);
} // end method



// -------------------------------------------------------------------------------
dtack_base2_c.prototype.serialize_latlng = function(latlng)
{
  var F = "serialize_latlng";
  
  return latlng.lat() + ";" + latlng.lng();

} // end method


// -------------------------------------------------------------------------------
dtack_base2_c.prototype.serialize_latlng2 = function(lat, lng)
{
  var F = "serialize_latlng2";
  
  return lat + ";" + lng;

} // end method


// -------------------------------------------------------------------------------
dtack_base2_c.prototype.unserialize_latlng = function(serial)
{
  var F = "unserialize_latlng";
  
  var latlng = null;
  var message = null;
  
  if (serial === undefined)
  {
  	message = "serial is undefined";
  }
  else
  if (serial === null)
  {
  	message = "serial is null";
  }
  else
  if (serial === "")
  {
  	message = "serial is blank";
  }
  else
  {
    var parts = serial.split(";");
    
    if (parts.length < 2)
    {
      message = "parts split length is " + parts.length;
	}
	else
	{
      var lat = parseFloat(parts[0]);
      if (isNaN(lat))
      {
        message = "lat \"" + parts[0] + "\" is NaN";
	  }
	  else
	  {
        var lng = parseFloat(parts[1]);
        if (isNaN(lng))
        {
          message = "lng \"" + parts[1] + "\" is NaN";
		}
		else
		{
          try
          {
            var latlng = new google.maps.LatLng(lat, lng);
            return latlng;
          }
	      catch(exception)
	      {
	        if (exception.name != undefined)
		      message = exception.name + ": " + exception.message;
	        else
		      message = exception;
		  }
		}
	  }
	}
  }
  
  if (message !== null)
    this.debug(F, message);
    
  return latlng;

} // end method
          
// -------------------------------------------------------------------------------

dtack_base2_c.prototype.$require = function($haystack, needle, haystack_name)
{
  var F = "dtack_base2_c::$require";
  
  if (haystack_name)
    haystack_name = "haystack " + this.vts(haystack_name);
  
  if (!haystack_name)
    haystack_name = $haystack.prop(this.SELECTOR_DESCRIPTOR_KEYWORD);
  
  if (!haystack_name)
    haystack_name = "haystack";
    
  var vts_needle = this.vts(needle);
    
  this.assert(haystack_name + " " + this.vts($haystack) + " object looking for needle " + vts_needle, $haystack)
  this.assert(haystack_name + " is an not a jquery object looking for needle " + vts_needle, $haystack instanceof jQuery);
  this.assert(haystack_name + " is empty looking for needle " + vts_needle, $haystack.length > 0);
  this.assert(haystack_name + " would not contain needle " + vts_needle, needle);
  
  $found = $haystack.find(needle);
  
  this.assert(haystack_name + " does not contain for needle " + vts_needle, $found.length > 0);
  
  this.debug_verbose(F, haystack_name + " contains " + $found.length + " of needle " + vts_needle);
  
  $found.prop(this.SELECTOR_DESCRIPTOR_KEYWORD, haystack_name + "->" + needle);
  
  return $found;
            
} // end method

// -------------------------------------------------------------------------------

dtack_base2_c.prototype.require_jquery_data = function($jquery_object, data, jquery_object_name)
{
  var F = "dtack_base2_c::require_jquery_data";
  
  if (jquery_object_name)
    jquery_object_name = "jquery_object " + this.vts(jquery_object_name);
  
  if (!jquery_object_name)
    jquery_object_name = $jquery_object.prop(this.SELECTOR_DESCRIPTOR_KEYWORD);
  
  if (!jquery_object_name)
    jquery_object_name = "jquery_object";
    
  var vts_data = this.vts(data);
    
  this.assert(jquery_object_name + " " + this.vts($jquery_object) + " object looking for data " + vts_data, $jquery_object)
  this.assert(jquery_object_name + " is an not a jquery object looking for data " + vts_data, $jquery_object instanceof jQuery);
  this.assert(jquery_object_name + " is empty looking for data " + vts_data, $jquery_object.length > 0);
  this.assert(jquery_object_name + " would not contain data " + vts_data, data);
  
  var value = $jquery_object.data(data);
  
  this.assert(jquery_object_name + " does not contain for data " + vts_data, value !== undefined && value !== null);
  
  this.debug_verbose(F, jquery_object_name + " data " + vts_data + " is " + this.vts(value));
  
  return value;
            
} // end method
