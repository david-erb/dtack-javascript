// dtack utility functions

var dtack_utility_includes = new Array();

//dtack_utility_includes.push(dtphp_url + "/javascript/dtack_utility.js");

// -------------------------------------------------------------------------------
function dtack_utility_include_once(url)
{
  for (var i in dtack_utility_includes)
    if (dtack_utility_includes[i] == url)
	  return;

  dtack_utility_include(url);
}

// -------------------------------------------------------------------------------
function dtack_utility_include(url)
{
  var head = document.getElementsByTagName('head')[0];

  var script = document.createElement('script');
  script.src = url;
  script.type = 'text/javascript';

  head.appendChild(script);

  dtack_utility_includes.push(url);
}

// -------------------------------------------------------------------------------
function dtack_utility_determine_current_script_url()
{
  var scripts = document.getElementsByTagName("script");
  
  var src;
  var message;
  
  if (!scripts)
  {
  	message = "no scripts tags";
  }
  else
  if (!scripts.length)
  {
  	message = "no scripts tags length";
  }
  else
  {
    var script = scripts[scripts.length - 1];

    if (script.getAttribute.length !== undefined) 
    {
      src = script.getAttribute("src");
    }
    else
    {
      src = script.getAttribute("src", 2);
	}
	
	if (!src)
	  message = "no scripts[" + scripts.length - 1 + "] src";
  }
  
  if (message)
    alert(message);
    
  return src;
}

// -------------------------------------------------------------------------------

function dtack_utility_element(id)
{
  return document.getElementById? document.getElementById(id): document.all? document.all[id]: null;
}

// ------------------------------------------------------------------
//
function dtack_utility_escape_html(s)
{
  return
    s.replace(/&/g, "&amp;").
    s.replace(/</g, "&lt;").
    s.replace(/>/g, "&gt;").
    s.replace(/'/g, "&apos;").
    s.replace(/"/g, "&quot;");

} // end function

// ------------------------------------------------------------------
//
function dtack_utility_escape_xml(s)
{
  s = s.replace(new RegExp("&", "g"), "&amp;");
  s = s.replace(new RegExp("<", "g"), "&lt;");
  s = s.replace(new RegExp(">", "g"), "&gt;");
  s = s.replace(new RegExp("'", "g"), "&apos;");
  s = s.replace(new RegExp("\"", "g"), "&quot;");

  return s;
} // end function

// ------------------------------------------------------------------
//
function dtack_utility_escape_jso(s)
{
  s = s.replace(new RegExp("\"", "g"), "\\\"");

  return s;
} // end function

// ------------------------------------------------------------------
//
function dtack_utility_jso(object)
{
  var s = "";

  for (var k in object)
  {
	s += s != ""? ", ": "";
	s += "\"" + k + "\": " + "\"" + object[k] + "\"";
  }

  return s;
} // end function

// ---------------------------------------------------------------------------------------
// this selects the limiter levels which should show
// The limiter select mechanism is a way to show some, all, or none of the grid filters.
// The mechanism must be enabled by $GLOBALS["host"]["limiter_select"]["enabled"] = true.
// The limiters are produced in groups, with each group having a level from one to nine.
// Level 1 limiters are assumed the most important, and level 9 are the least important.
// The limiter selection words have two CSS classes each, div1 which surrounds the link and div2 which is the link text.
// The code in projx/cleartags_remark.k assigns the limiter selection variables from the host.k file.

function dtack_utility_limiter_select(level)
{
  var i;
  var e;
  var id;
  var n = 0;
										/* for each of the possible levels */
  for (i=1; i<=9; i++)
  {
										/* id of the div containing the filters themselves */
	id = "limiter_" + i;
	e = dtack_utility_element(id);
    if (e)
	{
	  if (level == -1 || i >= level)
	  {
        var old_display = e.style.display;
		e.style.display = 'block';
        n++;
		//	alert('level ' + level + ' causes lighting up element id ' + id + ' from display [' + old_display + '] to [' + e.style.display + ']');
	  }
	  else
	  {
        var old_display = e.style.display;
		e.style.display = 'none';
		//	alert('level ' + level + ' causes darkening element id ' + id + ' from display [' + old_display + '] to [' + e.style.display + ']');
	  }
	}
										/* id of the div containing the <a> tag for the limiter selector */
	id = "limiter_trigger_div1_" + i;
	e = dtack_utility_element(id);
    if (e)
	{
	  if (i == level)
	  {
		e.className = 'limiter_selection_this_div1';
	  }
	  else
	  {
		e.className = 'limiter_selection_that_div1';
	  }
	}

										/* id of the div containing the text inside the <a> tag */
	id = "limiter_trigger_div2_" + i;
	e = dtack_utility_element(id);
    if (e)
	{
	  if (i == level)
	  {
		e.className = 'limiter_selection_this_div2';
	  }
	  else
	  {
		e.className = 'limiter_selection_that_div2';
	  }
	}

  }

										/* no filters means we don't need a refresh button */
  e = dtack_utility_element("dttoolbar_button_refresh_list_td");
  if (e)
	e.style.display = (n? 'block': 'none');

										/* no filters means we don't need any reset filters button */
  e = dtack_utility_element("dttoolbar_button_reset_filters_td");
  if (e)
	e.style.display = (n? 'block': 'none');

										/* let the form field have the current level */
  var field = dtack_utility_form_field("limiter_select");
  if (field)
    field.value = level;
}

// ---------------------------------------------------------------------------------------
// this supports all dhtml popups
// it must be called in the onload
// it depends on inclusion of tooltip/tooltip.js

function dtack_utility_write_arguments()
{
  var n = arguments.length;
  var i;

  var s = "";
  for (i=0; i<n; i++)
  {
    s += arguments[i] + " ";
  }

  document.write(s);
}

// ---------------------------------------------------------------------------------------
// this supports all dhtml popups
// it must be called in the onload
// it depends on inclusion of tooltip/tooltip.js

function dtack_utility_tooltip_init()
{
  Tooltip.init();
}

// ---------------------------------------------------------------------------------------
// this function is called from the onmouseover of tiny image thumbnails
// its job is to do a dhtml popup of a larger version (i.e. tiny4x) of the image
// this image is put there at the moment of upload
// typically, this will not happen unless there is a a nonzero $GLOBALS["host"]["dtobjects"]["tiny4x_xe"]
// the second argument identifies both the rollover trigger and the dhtml popup id
// the first will have an 'a' before the id, the second a 'b'

function dtack_utility_tiny4x_show(e, tiny4x_id)
{
  //alert("Tooltip is for element id `" + tiny4x_id + "'");


  doTooltip(e, 'b' + tiny4x_id, 'a' + tiny4x_id);
}

// ---------------------------------------------------------------------------------------
// this function is called from the onmouseout of tiny image thumbnails AND of the tiny4x dhtml windows
function dtack_utility_tiny4x_hide()
{
  hideTip();
}

// ---------------------------------------------------------------------------------------
// set the shadow for a checkbox
function dtack_utility_shadow_checkbox(checkbox)
{
  var F = "dtack_utility_shadow_checkbox";
  var shadow_name = checkbox.name.replace(/^shadow_/, "");

  var field = dtack_utility_form_field(shadow_name);

  if (field)
  {
	field.value = checkbox.checked? 1: 0;
	//alert(F + ": found shadow name `" + shadow_name + "', setting value `" + field.value + "'");
  }
  else
  {
	//alert(F + ": no such shadow name `" + shadow_name + "'");
  }
	
	                                    // eztask #12426: clicking a tab after changing a checkbox field does not warn you to save changes
	                                    // watchfrog #158
  try
  {
	_changed(field);
  }
  catch(exception)
  {
  }
  
}

// ---------------------------------------------------------------------------------------
function dtack_utility_form_field(field_name)
{
  var forms = document.forms;
  if (forms)
  {
    var nforms = document.forms.length;
    var iform;
    for (iform=0; iform<nforms; iform++)
    {
	  var fields = document.forms[iform].elements;
	  var nfields = fields.length;
	  var ifield;
	  for(ifield=0; ifield<nfields; ifield++)
	  {
		if (fields[ifield].name == field_name)
		{
		  //		  alert("form `" + document.forms[iform].name + "' contains field `" + field_name + "'");
		  return document.forms[iform].elements[ifield];
		}
	  }
	}
  }
  return undefined;
}

// ---------------------------------------------------------------------------------------
function dtack_utility_form_field_match(field_name_pattern)
{
  var forms = document.forms;
  if (forms)
  {
    var nforms = document.forms.length;
    var iform;
    for (iform=0; iform<nforms; iform++)
    {
	  var fields = document.forms[iform].elements;
	  var nfields = fields.length;
	  var ifield;
	  for(ifield=0; ifield<nfields; ifield++)
	  {
		if (fields[ifield].name.match(field_name_pattern))
		{
		  //		  alert("form `" + document.forms[iform].name + "' contains field `" + field_name + "'");
		  return document.forms[iform].elements[ifield];
		}
	  }
	}
  }
  return undefined;
}


// ---------------------------------------------------------------------------------------
function dtack_utility_date3_update(name)
{
  var form = document.forms[0];

  var today = new Date();

  var month = today.getMonth() + 1;
  if (form.elements[name + "_month"])
	month = form.elements[name + "_month"].value;

  var day = today.getDate();
  if (form.elements[name + "_day"])
	day = form.elements[name + "_day"].value;

  var year = today.getFullYear();
  if (form.elements[name + "_year"])
	year = form.elements[name + "_year"].value;

  month = parseInt(month);
  day = parseInt(day);
  year = parseInt(year);

  var s = ""
  if (month > 0)
    s = month;

  if (day > 0)
    s += (s != ""? "/": "") + day

  if (year > 0)
    s += (s != ""? "/": "") + year

  if (form.elements[name])
  {
	form.elements[name].value = s;

	if (month > 0 && day > 0 && year > 0 && form.elements[name].onchange)
	  form.elements[name].onchange();
  }


}

// ---------------------------------------------------------------------------------------
function dtack_utility_scroll_x()
{
  var scroll = 0;
  if (typeof window.pageXOffset == "number")
	scroll = window.pageXOffset;
  else
  if (document.documentElement && document.documentElement.scrollLeft)
	scroll = document.documentElement.scrollLeft;
  else
  if (document.body && document.body.scrollLeft)
	scroll = document.body.scrollLeft;
  else
  if (window.scrollX)
	scroll = window.scrollX;

  return scroll;
}

// ---------------------------------------------------------------------------------------
function dtack_utility_scroll_y()
{
  var scroll = 0;
  if (typeof window.pageYOffset == "number")
	scroll = window.pageYOffset;
  else
  if (document.documentElement && document.documentElement.scrollTop)
	scroll = document.documentElement.scrollTop;
  else
  if (document.body && document.body.scrollTop)
	scroll = document.body.scrollTop;
  else
  if (window.scrollY)
	scroll = window.scrollY;

  return scroll;
}

// --------------------------------------------------------------------

function dtack_utility_mouse_event_page_x(event_object)
{
  var page_x = 0;
										/* if caller does not deliver event_object, presume IE and get the last window event */
										/* watchfrog #17 */
  if (!event_object)
    event_object = window.event;

  if (event_object.pageX != undefined &&
      event_object.pageX != null)
  {
	page_x = event_object.pageX;
  }
  else
  if (event_object.clientX != undefined &&
      event_object.clientX != null)
  {
	page_x = event_object.clientX +
	  document.body.scrollLeft +
	  document.documentElement.scrollLeft;
  }

  return page_x;

} // end method

// --------------------------------------------------------------------

function dtack_utility_mouse_event_page_y(event_object)
{
  var page_y = 0;
										/* if caller does not deliver event_object, presume IE and get the last window event */
										/* watchfrog #17 */
  if (!event_object)
    event_object = window.event;

  if (event_object.pageY != undefined &&
      event_object.pageY != null)
  {
	page_y = event_object.pageY;
  }
  else
  if (event_object.clientY != undefined &&
      event_object.clientY != null)
  {
	page_y = event_object.clientY +
	  document.body.scrollTop +
	  document.documentElement.scrollTop;
  }

  return page_y;

} // end method

// --------------------------------------------------------------------

function dtack_utility_absolute_x(node)
{
  var x = 0;

  var tnode = node;
  while (tnode != null && tnode != undefined)
  {
	if (tnode.offsetLeft != undefined)
	{
	  if (false)
		dtack_environment.debug(
		  "dtack_utility_absolute_x",
		  " current x is " + x +
		  " to be added to " + tnode.tagName + " offsetLeft " + tnode.offsetLeft);

	  x += tnode.offsetLeft;
	}
	tnode = tnode.offsetParent;
  }

  return x;

} // end method

// --------------------------------------------------------------------

function dtack_utility_absolute_y(node)
{
  var y = 0;

  var tnode = node;
  while (tnode != null && tnode != undefined)
  {
	if (tnode.offsetTop != undefined)
	{
	  y += tnode.offsetTop;
	}
	tnode = tnode.offsetParent;
  }

  return y;

} // end method

// -------------------------------------------------------------------------------
// return true if an ancestor/progeny relationship exists between the given arguments
// watchfrog #11

function dtack_utility_ancestor_progeny(ancestor, progeny)
{
  var F = "ancestor_progeny";

  var pointer = progeny;

  while(pointer)
  {
	if (pointer == ancestor)
	{
	  //dtack_environment.debug(F, "found " + pointer.nodeName + "#" + pointer.id);
	  return true;
	}
	else
	{
	  //dtack_environment.debug(F, "passing up " + pointer.nodeName + "#" + pointer.id);
	}

	pointer = pointer.parentNode;
  }

  return false;
}

// -------------------------------------------------------------------------------

function dtack_utility_absolute_coordinates(element)
{
  var r = { x: element.offsetLeft, y: element.offsetTop };

  if (element.offsetParent)
  {
    var tmp = dtack_utility_absolute_coordinates(element.offsetParent);
    r.x += tmp.x;
    r.y += tmp.y;
  }
  return r;
}

// -------------------------------------------------------------------------------

function dtack_utility_relative_coordinates_jquery(event_object, reference)
{

  var mouse_x = dtack_utility_mouse_event_page_x(event_object);
  var mouse_y = dtack_utility_mouse_event_page_y(event_object);

  var jquery_position = $(reference).position();

//  alert("reference.id: " + reference.id +
//    "\nreference.type: " + reference.type +
//    "\nmouse_x: " + mouse_x +
//    "\njquery_postion.left: " + jquery_position.left);

  var r = {};
  r.x = mouse_x - parseInt(jquery_position.left.toFixed(0));
  r.y = mouse_y - parseInt(jquery_position.top.toFixed(0));

  return r;
}



// -------------------------------------------------------------------------------
// thanks to http://blogs.korzh.com/progtips/2008/05/28/absolute-coordinates-of-dom-element-within-document.html
/**
 * Retrieve the coordinates of the given event relative to the center
 * of the widget.
 *
 * @param event
 *   A mouse-related DOM event.
 * @param reference
 *   A DOM element whose position we want to transform the mouse coordinates to.
 * @return
 *    A hash containing keys 'x' and 'y'.
 */
function dtack_utility_relative_coordinates(event, reference)
{

                                        // use jquery to get relative coordinates instead of home-grown
                                        // watchfrog #136
  return dtack_utility_relative_coordinates_jquery(event, reference);

  var x, y;
  event = event || window.event;
  var el = event.target || event.srcElement;

  if (!window.opera && typeof event.offsetX != 'undefined')
  {
										// Use offset coordinates and find common offsetParent
	var pos = { x: event.offsetX, y: event.offsetY };

										// Send the coordinates upwards through the offsetParent chain.
	var e = el;
	while (e)
	{
	  e.mouseX = pos.x;
	  e.mouseY = pos.y;
	  pos.x += e.offsetLeft;
	  pos.y += e.offsetTop;
	  e = e.offsetParent;
	}

										// Look for the coordinates starting from the reference element.
	var e = reference;
	var offset = { x: 0, y: 0 }
	while (e)
	{
	  if (typeof e.mouseX != 'undefined') {
		x = e.mouseX - offset.x;
		y = e.mouseY - offset.y;
		break;
	  }
	  offset.x += e.offsetLeft;
	  offset.y += e.offsetTop;
	  e = e.offsetParent;
	}

										// Reset stored coordinates
	e = el;
	while (e)
	{
	  e.mouseX = undefined;
	  e.mouseY = undefined;
	  e = e.offsetParent;
	}
  }
  else
  {
										// Use absolute coordinates
	var pos = dtack_utility_absolute_coordinates(reference);
	x = event.pageX  - pos.x;
	y = event.pageY - pos.y;
  }
										// Subtract distance to middle
  return { x: x, y: y };
} // end method

// --------------------------------------------------------------------------------------
// cover all the background
function dtack_utility_show_modal_cover(panel_id)
{
										/* the panel which covers the page when the modal panel is displayed */
  var div = dtack_utility_element("dtack_utility_modal_cover_div");

  div.style.width = document.body.scrollWidth + "px";
  div.style.height = document.body.scrollHeight + "px";

  if (false)
  {
	alert(
	  "document.body.clientHeight: " + document.body.clientHeight + "\n" +
	  "document.body.scrollHeight: " + document.body.scrollHeight + "\n" +
	  "document.body.offsetHeight: " + document.body.offsetHeight + "\n");
  }

										/* show the div */
  div.style.display = "block";

										/* the panel where the modal panel is displayed */
  var panel = dtack_utility_element(panel_id);

										/* for now, hardcode the size this modal thing will be */
  var w = 580;
  var h = 400;

  var x = parseInt((document.body.clientWidth - w) / 2);
  var y = parseInt((document.body.clientHeight - h) / 2);

										/* the scrollpoint of the page */
  panel.style.left = dtack_utility_scroll_x() + x + "px";
  panel.style.top = dtack_utility_scroll_y() + y + "px";
  panel.style.width = w + "px";
  panel.style.height = h + "px";

										/* show the panel */
  panel.style.display = "block";
										/* move the shim to back up the panel */
  var modal_shim = dtack_utility_element("dtack_utility_modal_shim_iframe");

  modal_shim.style.left = panel.style.left;
  modal_shim.style.top = panel.style.top;

  modal_shim.style.width = panel.offsetWidth + "px";
  modal_shim.style.height = panel.offsetHeight + "px";

  modal_shim.style.display = "block";

  //  alert("modal_shim is at " + modal_shim.style.left + "," + modal_shim.style.top + " for size " + modal_shim.style.width + " by " + modal_shim.style.height);
}

// --------------------------------------------------------------------------------------
// remove the background cover
function dtack_utility_hide_modal_cover(panel_id)
{
										/* hide the cover div */
  var div = dtack_utility_element("dtack_utility_modal_cover_div");
  div.style.display = "none";
										/* hide the panel where the modal panel is displayed */
  var panel = dtack_utility_element(panel_id);
  panel.style.display = "none";

										/* hde the modal_shim */
  var modal_shim = dtack_utility_element("dtack_utility_modal_shim_iframe");
  modal_shim.style.display = "none";
}

// ----------------------------------------------------------------------------
function dtack_utility_submit_command_to(script_url, target, form, command, arguments)
{

  if (command != undefined)
  {
  	var form_field = dtack_utility_form_field("command");
  	if (form_field != undefined)
  	  form_field.value = command;
  }
    
  if (arguments != undefined)
  {
  	var form_field = dtack_utility_form_field("arguments");
  	if (form_field != undefined)
  	  form_field.value = arguments;
  }

  return dtack_utility_submit_to(script_url, target, form);
}

// ----------------------------------------------------------------------------
function dtack_utility_submit_to(script_url, target, form)
{

  var should_show_waiting = true;
  
  if (form == undefined ||
      form == "")
  {
    form = document.forms[0];
  }

                                        // preserve the action and target the form originally has defined
  var preserved_action = form.action;
  var preserved_target = form.target;

  if (target != undefined &&
      target != "")
  {
    form.target = target;
    
    if (target != "_self" &&
        target != "_parent")
      should_show_waiting = false;
  }

  if (script_url != undefined)
    form.action = script_url;

  var result = dtack_utility_submit_form(form, should_show_waiting);
  
  
                                        // the path for the form ends with a slash?
                                        // ie 10 does this when the <form> tag has no action or blank action
                                        // eztask #10527: (HQ-Reports) 405 method not allowed in IE10 tabs
  if (preserved_action.length > 0 &&
      preserved_action.substring(preserved_action.length-1) == "/")
    preserved_action = location.href;

                                        // restore the action and target the form originally had defined
  form.action = preserved_action;
  form.target = preserved_target;
    
  
  return result;
}
              
// ----------------------------------------------------------------------------
function dtack_utility_submit_form(form, should_show_waiting)
{

  if (form == undefined)
    form = document.forms[0];

  if (should_show_waiting == undefined)
    should_show_waiting = true;
    
  if (should_show_waiting)
    dtack_utility_waiting();
    
  form.submit();
  
  return false;
}

// -------------------------------------------------------------------------------

function dtack_utility_option_value(
  options,
  option,
  default_value)
{
  if (options == undefined ||
      options == null ||
      options == "")
    return default_value;

  if (options[option] == undefined)
    return default_value;
    
  return options[option];

} // end method

// ----------------------------------------------------------------------------
// most general post method there is
// eztask #11732: (hq) Average Days to Perform Corrective actions excel button gives ugly excel contents
// watchfrog #
function dtack_utility_post(options)
{
  var F = "post";

  var should_show_waiting = dtack_utility_option_value(options, "should_show_waiting", "no") == "yes";
    
  if (should_show_waiting)
    dtack_utility_waiting();

  var preserved_values = new Object();
  
  var form_name = dtack_utility_option_value(options, "form", document.forms[0].name);
  var form_action = dtack_utility_option_value(options, "url", undefined);
  var form_target = dtack_utility_option_value(options, "target", undefined);
    
  if (form_action != undefined)
  {
    preserved_values["form_action"] =  document.forms[form_name].action;
    document.forms[form_name].action = form_action;
  }
    
  if (form_target != undefined)
  {
    preserved_values["form_target"] =  document.forms[form_name].target;
    document.forms[form_name].target = form_target;
  }

  document.forms[form_name]["command"].value = dtack_utility_option_value(options, "command", "");
    
  document.forms[form_name]["arguments"].value = dtack_utility_option_value(options, "arguments", "");
  
  document.forms[form_name].submit();
    
  if (preserved_values["form_target"] != undefined)
  {
    document.forms[form_name].target = preserved_values["form_target"];
  }
    
  if (preserved_values["form_action"] != undefined)
  {
    document.forms[form_name].action = preserved_values["form_action"];
  }
  
  return false;

} // end function

// ----------------------------------------------------------------------------
// light up the div which will indicate a "please wait" state
function dtack_utility_waiting()
{
  var element = dtack_utility_element("waiting_div");

  if (element)
  {
    element.style.display = "";

	var image = document.images["waiting_img"];
	if (image)
	{
	  image.src = "../../waiting.gif";
	}
  }

}

// -------------------------------------------------------------------
// turn off the div which will indicate a "please wait" state
function dtack_utility_notwaiting()
{
  var element = dtack_utility_element("waiting_div");

  if (element)
  {
    element.style.display = "none";
  }

}

// -------------------------------------------------------------------
// watchfrog #146

function dtack_javascript_utility_feature_check(feature_name) 
{
  var F = "dtack_javascript_utility_feature_check";
  
  try
  {
    if (dtack_javascript_features === undefined)
      return;
  }
  catch(exception)
  {
  	return;
  }
    
                                        // nag if any features but not this feature
  var feature_count = 0;
  for(var index in dtack_javascript_features)
  {
  	var feature_object = dtack_javascript_features[index];
  	
  	if (feature_name == feature_object.name)
  	  return;
  	feature_count++;
  }
                                        // this feature name not found?
  if (feature_count > 0)
  {
  	                                    // do the nag
    alert("+feature: " + feature_name);
                                        // make pseudo-feature to prevent more nags
    dtack_javascript_features[dtack_javascript_features.length] = {
      "name": feature_name,
      "md5": "nagged"
	};
  }
} // end function


// -------------------------------------------------------------------

                                        // allow the maxate mechanism to be disabled at runtime (to support making pdf)
var dtack_utility_maxate_enabled = true;

var dtack_utility_maxate_scrolling_id = undefined;
var dtack_utility_maxate_footer_height = 0;
var dtack_utility_maxate_footer_height = 0;

                                        // provide a global pink_height variable which can be manipulated by pages
                                        // watchfrog #204
var dtack_utility_maxate_pink_height = 0;

function dtack_utility_maxate_resize(id, from) 
{
  var F = "dtack_utility_maxate_resize";
    
                                        // allow the maxate mechanism to be disabled at runtime (to support making pdf)
                                        // this will typically be set to false in with the $pdf_css cleartag assignment
                                        // see nodor ecodatabase/trunk/ecod/ecod.common.demand_helper_c-6D105D
  if (!dtack_utility_maxate_enabled)
    return;

  if (id == undefined)
    id = dtack_utility_maxate_scrolling_id;
  if (id == undefined)
    return;
    
  $id = $("#" + id);
  if ($id.length == 0)
  {
  	return;
  }
  
  var offset = $id.offset();

  var message = "resizing #" + id + ":";
  
  var window_w = parseInt($(window).width().toFixed(0));
  var window_h = parseInt($(window).height().toFixed(0));
  message += " (window) " + window_w + "x" + window_h;
  
                                        // adjust for pink_height variable which can be manipulated by pages
                                        // watchfrog #204
  window_h -= dtack_utility_maxate_pink_height;
               
  var w = window_w - offset.left - dtack_utility_maxate_sidebar_width;
  var h = window_h - offset.top - dtack_utility_maxate_footer_height;
  $id.css({"width": w.toFixed(0) + "px"});
  $id.css({"height": h.toFixed(0) + "px"});
  
//$("#dtack_utility_maxate_resize_message_div").html(F + ": " + message);

  dtack_utility_debug(F, "from " + from + ": " + message);

  try
  {
    global_page_object.pull_triggers(global_page_object.TRIGGER_EVENTS.WINDOW_RESIZED, {from: from});
  }
  catch(exception)
  {
  	var message = exception;
    if (exception.name != undefined)
	  message = exception.name + ": " + exception.message;
    dtack_utility_debug(F, "failed to pull triggers: " + message);
  }
  
} // end function
 
// -------------------------------------------------------------------
// watchfrog #145

function dtack_utility_maxate_ready(id, sidebar_width, footer_height) 
{
  var F = "dtack_utility_maxate_ready";
  
  if (sidebar_width == undefined &&
      footer_height == undefined)
  {
  	sidebar_width = 0;
    footer_height = 0;
  }
  else
  if (sidebar_width != undefined &&
      footer_height == undefined)
  {
  	footer_height = sidebar_width;
  	sidebar_width = 0;
  }
  
  dtack_utility_maxate_scrolling_id = id;
  dtack_utility_maxate_sidebar_width = sidebar_width;
  dtack_utility_maxate_footer_height = footer_height;
  
                                        // nag if any features but not this feature
  dtack_javascript_utility_feature_check("dtack_javascript maxate");
  
                                        // call the resize_maxate function when the window resizes
  $(window).resize(
    function()
    {
      dtack_utility_maxate_resize(undefined, "window resize event");
    });
 
  $(document).ready(
    function()
    {
  
      dtack_utility_maxate_pink_height = parseInt(dtack_environment.host_value("user_preferences.values.dtack_utility_maxate_pink_height", 0));
      if (isNaN(dtack_utility_maxate_pink_height))
         dtack_utility_maxate_pink_height = 0;
         
                                        // call the resize_maxate function when the document is ready
                                        // put in own thread to let the window resize event happen first
                                        // watchfrog #169
      setTimeout(function(){dtack_utility_maxate_resize(undefined, "document ready/delay 1");}, 1);
   }
  );
} // end function

// ------------------------------------------------------------------------------
// watchfrog #147

function dtack_utility_show_jquery_modal_dialog(title, buttons)
{
  buttons = buttons.split(",");
  
  $(".modal_toolbar_table .dttoolbar_button").css("display", "none");
  var buttons_object = new Object();
  for(var index in buttons)
  {
  	$("#modal_" + buttons[index] + "_button").css("display", "");
  }
  
  $("#modal_dialog_div").dialog(
    {
      "dialogClass": "modal_dialog_no_close",
      "modal": true,
      "title": title,
      "width": 500,
      "height": 500
	}
  );
}

// ------------------------------------------------------------------------------
function dtack_utility_hide_jquery_modal_dialog()
{
  $("#modal_dialog_div").dialog("close");
}

// ------------------------------------------------------------------------------
function dtack_utility_debug(F, message)
{
  try
  {
    global_page_object.debug(F, message);
  }
  catch(exception)
  {
  }
}

// -------------------------------------------------------------------
// eztask #13386: checkbox javascript no longer works

function dtack_utility_checkboxes(field_name, checked)
{
  var forms = document.forms;
  if (forms)
  {
    var nforms = document.forms.length;
    var iform;
    for (iform=0; iform<nforms; iform++)
    {
      var fields = document.forms[iform].elements;
      var nfields = fields.length;
      var ifield;
      for(ifield=0; ifield<nfields; ifield++)
      {
        if (fields[ifield].name == field_name)
        {
          document.forms[iform].elements[ifield].checked = checked;
        }
      }
    }
  }
}

