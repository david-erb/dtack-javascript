// --------------------------------------------------------------------
// class representing a scrollable DOM element

										// inherit the base methods and variables
dtack__dom__scrollable_c.prototype = new dtack_base2_c();

										// override the constructor
dtack__dom__scrollable_c.prototype.constructor = dtack__dom__scrollable_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__dom__scrollable_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__dom__scrollable_c";

	this.parent = dtack_base2_c.prototype;

	if (classname == undefined)
	  classname = F;
										// call the base class constructor helper 
	this.parent.constructor.call(this, dtack_environment, classname);
	
	this.selector = undefined;
  }
} // end constructor

// -------------------------------------------------------------------------------
dtack__dom__scrollable_c.prototype.initialize = function(selector)
{
  var F = "initialize";
  
  this.selector = selector;

} // end method

// -------------------------------------------------------------------------------
// extract scroll amount from DOM and serialize

dtack__dom__scrollable_c.prototype.serialize = function()
{
  var F = "serialize";

  var x = 0.0;
  var y = 0.0;
  if (this.selector == "window")
  {
  	x = $(window).scrollTop();
  	y = $(window).scrollLeft();
  }
  else
  {
  	x = $(this.selector).scrollTop();
  	y = $(this.selector).scrollLeft();
  }
  
  var serialized = this.selector + "," + parseFloat(x).toFixed(0) + "," + parseFloat(y).toFixed(0);
  
  return serialized;

} // end method

// --------------------------------------------------------------------
// apply the given scroll to the DOM 

dtack__dom__scrollable_c.prototype.apply = function(scrollable_spec)
{
  var F = "apply";

  var parts = scrollable_spec.split(",");
  var top = parseInt(parts[1]);
  var left = parseInt(parts[2]);
  
  if (this.selector == "window")
  {
    $(window).scrollTop(top);
    $(window).scrollLeft(left);
  }
  else
  {
  	$(this.selector).scrollTop(top);
  	$(this.selector).scrollLeft(left);

    this.debug(F, 
      "applied [" + left + ", " + top + "] to " + this.selector +
      " leaving [" + $(this.selector).scrollLeft() + ", " + $(this.selector).scrollTop() + "]" +
      " whose size is " + $(this.selector).width() + "x" + $(this.selector).height() +
      " with overflow " + $(this.selector).css("overflow"));
  }

} // end method
