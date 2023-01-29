// this object represents the form in a session report
// the form has multiple fields in it which it can fetch from the server
// it operates within the dtack_environment it is given for user interaction
// during onload, it discovers all the fields which need values and fetches them from the server
// --------------------------------------------------------------------
										// inherit the base methods and variables
dtack_bezel17s_c.prototype = dtack_bezel17_c;
										/* remember who the base class is */
dtack_bezel17s_c.prototype.parent = dtack_bezel17_c;

function dtack_bezel17s_c(dtack_environment)
{
										/* operate within this environment */
  this.dtack_environment = dtack_environment;

  this.classname = "dtack_bezel17s_c";
										/* array of fields on this form */
  this.bezel17s = new Array();


  // --------------------------------------------------------------------
  // discover, create and wrap the div with the given id using images with the given url prefix

  this.discover_create_and_wrap = function(url_prefix, image_type)
  {
	var F = "create_and_wrap";

	var divs = document.getElementsByTagName("div");

	var dtack_bezel_classname_regexp = new RegExp(".*(dtack_bezel).*");
	for (var i in divs)
	{
	  if (i != "length")
	  {
		var div = divs[i];
		if (div.className == undefined)
		{
		}
		else
		if (!div.className.match(dtack_bezel_classname_regexp))
		{
		  //dtack_environment.debug(F, "div \"" + i + "\" classname is " + div.className + " which does not match");
		}
		else
		{
		  dtack_environment.debug(F, 
		  "div \"" + div.id + "\"" +
		  " classname is \"" + div.className + "\"");
		  
		  var bezel = dtack_bezel17s.create_and_wrap(div.id, url_prefix, image_type);
		}
	  }
	}
  }

  // --------------------------------------------------------------------
  // create and wrap the div with the given id using images with the given url prefix

  this.create_and_wrap = function(id, url_prefix, image_type)
  {
	var F = "create_and_wrap";

										/* make a new bezel with the given name */
	var bezel = new dtack_bezel17_c(this.dtack_environment);

										/* keep track of all bezels on the page */
	this.bezel17s.push(id);

	bezel.wrap(id, url_prefix, image_type);

	return bezel;
  }

} // end class

