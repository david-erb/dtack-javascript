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
dtack_button_c.prototype = dtack_base_c;
										/* remember who the base class is */
dtack_button_c.prototype.parent = dtack_base_c;

function dtack_button_c(dtack_environment)
{
										/* operate within this environment */
  this.dtack_environment = dtack_environment;

  this.classname = "dtack_button_c";

  this.button_id = "";

  this.button_element = null;

  this.background_url_pattern = "";

  this.background_images = new Array();

  this.stays_down = false;

  // --------------------------------------------------------------------
  // create and wrap the div with the template contents

  this.skin = function(id, background_url_pattern)
  {
	var F = "skin";

										/* remember the content div id that we will be wrapping */
	this.button_id = id;
	this.background_url_pattern = background_url_pattern;

										/* get the element to be skinned */
	this.button_element = this.element(id);
	  
	if (this.button_element && this.button_element.style.backgroundImage.substr(0, 4) == "url(")
	{
	  this.debug(F, "already skinned " + id);
	}
	else
	if (this.button_element)
	{
	  this.button_element.nodeValue = "skinned";

	  this.background_images[0] = this.background_url_pattern.replace("*", "0");
	  this.background_images[1] = this.background_url_pattern.replace("*", "1");
	  this.background_images[2] = this.background_url_pattern.replace("*", "2");

	  if (this.background_url_pattern.match(/@/))
	  {
		if (false)
		  this.debug(F, 
		    "skinning " + id + 
		    " from " + this.background_url_pattern +
		    " with innerText \"" + this.button_element.innerText + "\"");
		this.background_images[0] = this.background_images[0].replace("@", this.button_element.innerText);
		this.background_images[1] = this.background_images[1].replace("@", this.button_element.innerText);
		this.background_images[2] = this.background_images[2].replace("@", this.button_element.innerText);
		this.button_element.innerText = "";
	  }
	  else
	  {
		if (true)
		{
		  this.debug(F, "skinning " + id +
		    " from " + this.background_url_pattern);
		}
	  }


	  var that = this;
	  this.button_element.onmouseout = function() {that.state_changed(0);}
	  this.button_element.onmouseover = function() {that.state_changed(1);}
	  this.button_element.onmousedown = function() {that.state_changed(2);}

										/* set the initial state */
	  this.state_changed(2);
	  this.state_changed(1);
	  this.state_changed(0);
	}
	else
	{
	  this.debug(F, "could found not find element with id " + id);
	}

  } // end method

  // --------------------------------------------------------------------

  this.state_changed = function(which)
  {
	var F = "state_changed";

    if (this.stays_down)
	  which = 2;

	if (this.button_element)
	{
	  //dtack_environment.debug(F, "replacing " + this.button_id + " with " + this.background_images[which]);

	  this.button_element.style.backgroundImage = "url(" + this.background_images[which] + ")";
	}
  } // end method

} // end class



