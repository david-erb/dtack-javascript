/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 
  ! THIS FILE IS A COMPONENT OF THE DTACK_JAVASCRIPT LIBRARY
  ! Copyright (C) 2009 Dtack Inc. All Rights Reserved
  ! This software is provided AS IS with no warranty expressed or implied.
  ! Dtack Inc. accepts no liability for use or misuse of this file.
  ! http://www.dtack.com  dtack@dtack.com  telephone +360.670.5775
  ! Dtack Inc., 1009 Homestead Ave., Port Angeles, WA USA 98362
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */


// the dtack_base is a set of functions and variables which are common to all dtack_bezel17 objects
// it uses the dtack_environment object to interact with the operator
// --------------------------------------------------------------------
dtack_base_c =
{
  classname: "",

  // --------------------------------------------------------------------
  okbox: function(F, message) 
  {
	this.dtack_environment.okbox(F, message);
  },

  // -------------------------------------------------------------------
  error: function(F, message) 
  {
	this.dtack_environment.error(F, message);
  },

  // -------------------------------------------------------------------
  state: function(message) 
  {
	this.dtack_environment.state(message);
  },

  // -------------------------------------------------------------------
  debug: function(F, message) 
  {
	this.dtack_environment.debug(this.classname + "::" + F, message);
  },

  // -------------------------------------------------------------------
  element: function(id)
  {
	return this.dtack_environment.element(id);
  } // end method


// ---------------------------------------------------------
} // end class
