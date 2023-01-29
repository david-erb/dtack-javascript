// <!-- :code_tree=ecod.core: -->
// --------------------------------------------------------------------
dtack_javascript__harnesses__page_base_c.prototype = new dtack_page_base_c();
dtack_javascript__harnesses__page_base_c.prototype.base = dtack_page_base_c.prototype;
dtack_javascript__harnesses__page_base_c.prototype.constructor = dtack_page_base_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack_javascript__harnesses__page_base_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack_javascript__harnesses__page_base_c";

										/* call the base class constructor helper */
	dtack_javascript__harnesses__page_base_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  classname != undefined? classname: F);
  }
  
} // end constructor


// -------------------------------------------------------------------------------
// this can be called in the head, possibly before any dom elements are loaded

dtack_javascript__harnesses__page_base_c.prototype.initialize = function(options)
{
  var F = "dtack_javascript__harnesses__page_base_c::initialize";

  this.debug(F, "initializing " + this.option_keys_text(options));
  
										/* call the base class initializer */
  dtack_javascript__harnesses__page_base_c.prototype.base.initialize.call(this, options);
  
} // end function

// -------------------------------------------------------------------------------
// this is called in the document.ready, or at least after all elements are loaded

dtack_javascript__harnesses__page_base_c.prototype.activate = function(options)
{
  var F = "dtack_javascript__harnesses__page_base_c::activate";

  this.debug(F, "activating " + this.option_keys_text(options));
  
										/* call the base class activation routine */
  dtack_javascript__harnesses__page_base_c.prototype.base.activate.call(this, options);

} // end function
                         