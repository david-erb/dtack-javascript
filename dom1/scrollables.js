// --------------------------------------------------------------------
// class representing a DOM table

										// inherit the base methods and variables
dtack__dom__scrollables_c.prototype = new dtack_base2_c();

										// override the constructor
dtack__dom__scrollables_c.prototype.constructor = dtack__dom__scrollables_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__dom__scrollables_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__dom__scrollables_c";

	this.parent = dtack_base2_c.prototype;

	if (classname == undefined)
	  classname = F;
										// call the base class constructor helper 
	this.parent.constructor.call(this, dtack_environment, classname);
	
	this.list = new Object();
	
	this.most_recently_serialized = undefined;
  }                       
} // end constructor

// -------------------------------------------------------------------------------
dtack__dom__scrollables_c.prototype.initialize = function(options)
{
  var F = "initialize";

} // end method

// -------------------------------------------------------------------------------
dtack__dom__scrollables_c.prototype.add = function(selector)
{
  var F = "initialize";

  if (this.list[selector] == undefined)
  {
  	this.debug_verbose(F, "adding selector \"" + selector + "\"");
  	this.list[selector] = new dtack__dom__scrollable_c(this.dtack_environment);
  	this.list[selector].initialize(selector);
  }
} // end method

// -------------------------------------------------------------------------------
dtack__dom__scrollables_c.prototype.serialize = function()
{
  var F = "serialize";

  var serialized = "";
  for (var selector in this.list)
  {
  	var t = this.list[selector].serialize();
  	if (t.length > 0)
  	  serialized += (serialized.length == 0? "": ";") + t;
  }
  
  if (serialized == "")
  	this.debug(F, "no selectors have been added so nothing to serialize");
  
  return serialized;

} // end method

// --------------------------------------------------------------------
// discover the row nodes to use for list rows

dtack__dom__scrollables_c.prototype.apply = function(serialized)
{
  var F = "apply";

  this.most_recently_serialized = serialized;
  
  var scrollable_specs = serialized.split(";");
  
  for (var k in scrollable_specs)
  {
  	var scrollable_spec = scrollable_specs[k];
  	
  	var parts = scrollable_spec.split(",");
  	if (parts.length == 3)
  	{
  	  var selector = parts[0];
  	  if (this.list[selector] != undefined)
  	  {
  	    this.list[selector].apply(scrollable_spec);
	  }
	  else
	  {
	    this.debug(F, "can't apply scrollable_spec \"" + scrollable_spec + "\" because no scrollable with selector \"" + selector + "\"");
	  }
	}
	else
	{
	  this.debug(F, "can't apply scrollable_spec \"" + scrollable_spec + "\" because split gave " + parts.length + " parts, not 3");
	}
  }

} // end method


// --------------------------------------------------------------------
// reapply the most recently applied serialized scrollables

dtack__dom__scrollables_c.prototype.reapply = function()
{
  var F = "reapply";

  if (this.most_recently_serialized !== undefined)
    this.apply(this.most_recently_serialized);

} // end method
