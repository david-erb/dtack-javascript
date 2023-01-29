/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 
  ! THIS FILE IS A COMPONENT OF THE DTACK_JAVASCRIPT LIBRARY
  ! Copyright (C) 2009 Dtack Inc. All Rights Reserved
  ! This software is provided AS IS with no warranty expressed or implied.
  ! Dtack Inc. accepts no liability for use or misuse of this file.
  ! http://www.dtack.com  dtack@dtack.com  telephone +360.670.5775
  ! Dtack Inc., 1009 Homestead Ave., Port Angeles, WA USA 98362
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */


// this object represents the set of dualdown controls on the page
// --------------------------------------------------------------------
										// inherit the base methods and variables
dtack_dualdowns_c.prototype = new dtack_base2_c();
										/* remember who the base class is */
dtack_dualdowns_c.prototype.parent = dtack_base2_c;

function dtack_dualdowns_c(dtack_environment)
{
										/* operate within this environment */
  this.dtack_environment = dtack_environment;

  this.classname = "dtack_dualdowns_c";
										/* array of fields on this form */
  this.dualdowns = new Array();
} // end constructor

// --------------------------------------------------------------------
// create and initialize the div with the given name
// the from, into and hidden field names are derived from the name according to a naming convention

dtack_dualdowns_c.prototype.create_and_initialize = function(name)
{
  var F = "create_and_initialize";

										/* make a new dualdown object */
  var dualdown = new dtack_dualdown_c(
	this.dtack_environment);

										/* keep track of all dualdowns on the page */
  this.dualdowns[name] = dualdown;
										/* initialize the object we created */
  dualdown.initialize(name);
										/* return the object we created */
  return dualdown;

} // end method


// --------------------------------------------------------------------
// move selected items from the "from" list into the "into" list

dtack_dualdowns_c.prototype.insert = function(name, do_all)
{
  var F = "insert";
										/* get the specific dualdown to act on */
  var dualdown = this.dualdowns[name];
										/* this one is not yet created? */
  if (dualdown == undefined)
  {
										/* make a new dualdown object using the name */
	dualdown = this.create_and_initialize(name);
  }
										/* act on the specific dualdown */
  dualdown.insert(do_all);

} // end method


// --------------------------------------------------------------------
// move selected items from the "into" list into the "from" list

dtack_dualdowns_c.prototype.remove = function(name, do_all)
{
  var F = "remove";
										/* get the specific dualdown to act on */
  var dualdown = this.dualdowns[name];
										/* this one is not yet created? */
  if (dualdown == undefined)
  {
										/* make a new dualdown object using the name */
	dualdown = this.create_and_initialize(name);
  }
										/* act on the specific dualdown */
  dualdown.remove(do_all);

} // end method




// --------------------------------------------------------------------
// filter items in the "from" list based on text in the textbox

dtack_dualdowns_c.prototype.apply_from_filter = function(name)
{
  var F = "apply_from_filter";
										/* get the specific dualdown to act on */
  var dualdown = this.dualdowns[name];
										/* this one is not yet created? */
  if (dualdown == undefined)
  {
										/* make a new dualdown object using the name */
	dualdown = this.create_and_initialize(name);
  }
										/* act on the specific dualdown */
  dualdown.apply_from_filter();

} // end method




// --------------------------------------------------------------------
// clear the filter by showing all items in the "from" list and setting the textbox to blank

dtack_dualdowns_c.prototype.clear_from_filter = function(name)
{
  var F = "clear_from_filter";
										/* get the specific dualdown to act on */
  var dualdown = this.dualdowns[name];
										/* this one is not yet created? */
  if (dualdown == undefined)
  {
										/* make a new dualdown object using the name */
	dualdown = this.create_and_initialize(name);
  }
										/* act on the specific dualdown */
  dualdown.clear_from_filter();

} // end method