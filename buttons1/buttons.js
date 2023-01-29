/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 
  ! THIS FILE IS A COMPONENT OF THE DTACK_JAVASCRIPT LIBRARY
  ! Copyright (C) 2009 Dtack Inc. All Rights Reserved
  ! This software is provided AS IS with no warranty expressed or implied.
  ! Dtack Inc. accepts no liability for use or misuse of this file.
  ! http://www.dtack.com  dtack@dtack.com  telephone +360.670.5775
  ! Dtack Inc., 1009 Homestead Ave., Port Angeles, WA USA 98362
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */


// this object represents the form in a session report
// the form has multiple fields in it which it can fetch from the server
// it operates within the dtack_environment it is given for user interaction
// during onload, it discovers all the fields which need values and fetches them from the server
// --------------------------------------------------------------------
										// inherit the base methods and variables
dtack_buttons_c.prototype = dtack_button_c;
										/* remember who the base class is */
dtack_buttons_c.prototype.parent = dtack_button_c;

function dtack_buttons_c(dtack_environment)
{
										/* operate within this environment */
  this.dtack_environment = dtack_environment;

  this.classname = "dtack_buttons_c";
										/* array of fields on this form */
  this.buttons = new Array();


  // --------------------------------------------------------------------
  // discover and skin all the buttons according to the class naming convention

  this.discover_and_skin = function(classname_pattern, background_url_pattern)
  {
	var F = "discover_and_skin";

	var anchors = document.getElementsByTagName("a");

	var classname_regexp = new RegExp(classname_pattern);

    var nskinned = 0;
    var nreskinned = 0;
	for (var i in anchors)
	{
	  if (i != "length")
	  {
		var anchor = anchors[i];
		if (anchor.className == undefined)
		{
		}
		else
		if (!anchor.className.match(classname_regexp))
		{
		  //dtack_environment.debug(F, "anchor \"" + i + "\" classname is " + anchor.className + " which does not match");
		}
		else
		{
		  //dtack_environment.debug(F, 
		  //  "anchor \"" + anchor.id + "\"" +
		  //  " classname is \"" + anchor.className + "\"");
		  
		  if (this.buttons[anchor.id] == undefined)
		  {
			this.create_and_skin(anchor.id, background_url_pattern);
			nskinned++;
		  }
		  else
		  {
			this.buttons[anchor.id].skin(anchor.id, background_url_pattern);
			nreskinned++;
		  }

		}
	  }
	}

	this.dtack_environment.debug(
	  F, 
	  "discovered and skinned " + nskinned +
	  " and reskinned " + nreskinned + 
	  " buttons of classname pattern " + classname_pattern);
  }


  // --------------------------------------------------------------------
  // create and skin the div with the given id using images with the given url prefix

  this.create_and_skin = function(id, background_url_pattern)
  {
	var F = "create_and_skin";

										/* make a new button object */
	var button = new dtack_button_c(this.dtack_environment);

										/* keep track of all buttons on the page */
	this.buttons[id] = button

	button.skin(id, background_url_pattern);

	return button;
  }

} // end class

