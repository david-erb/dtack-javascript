// this object represents the form in a session report
// the form has multiple fields in it which it can fetch from the server
// it operates within the dtack_environment it is given for user interaction
// during onload, it discovers all the fields which need values and fetches them from the server
// --------------------------------------------------------------------
										// inherit the base methods and variables
dtack_bezel17_c.prototype = dtack_base_c;
										/* remember who the base class is */
dtack_bezel17_c.prototype.parent = dtack_base_c;

function dtack_bezel17_c(dtack_environment)
{
										/* operate within this environment */
  this.dtack_environment = dtack_environment;

  this.classname = "dtack_bezel17_c";

  this.template_name = "dtack_bezel17_template";

  this.contents_id = "";

  this.top_middle_div_id = "";
  this.bottom_middle_div_id = "";

  // --------------------------------------------------------------------
  // create and wrap the div with the template contents

  this.wrap = function(id, url_prefix, image_type)
  {
	var F = "wrap";
										/* remember the content div id that we will be wrapping */
	this.contents_id = id;

	var template_div = this.element(this.template_name);

	if (template_div)
	{
										/* get the template html */
	  var template_html = template_div.innerHTML;

	  var middle_td_id = id + "_middle_td";
	  var middle_div_id = id + "_middle_div";

	  this.top_middle_div_id = id + "_top_middle_div";

	  this.bottom_middle_div_id = id + "_bottom_middle_div";

	  template_html = template_html.replace("dtack_bezel17_middle_td", middle_td_id);
	  template_html = template_html.replace("dtack_bezel17_middle_div", middle_div_id);

	  template_html = template_html.replace("dtack_bezel17_top_middle_div", this.top_middle_div_id);
	  template_html = template_html.replace("dtack_bezel17_bottom_middle_div", this.bottom_middle_div_id);

	  var url_prefix_regexp = new RegExp("url_prefix", "gi");
	  template_html = template_html.replace(url_prefix_regexp, url_prefix);

	  var image_type_regexp = new RegExp("image_type", "gi");
	  template_html = template_html.replace(image_type_regexp, image_type);


										/* get the element to be wrapped */
	  var contents_div = this.element(id);
	  
	  if (contents_div)
	  {
										/* remember the html form of the contents to be wrapped */
		var contents_html = contents_div.innerHTML;

										/* replace the contents with the modified template */
		contents_div.innerHTML = template_html;

		var middle_div = this.element(middle_div_id);

		if (middle_div)
		{
		  middle_div.innerHTML = contents_html;
		  //		  middle_div.marginTop = "40px";
		  //		  middle_div.style.backgroundColor = "#FFCCCC";
		}
		else
		{
		  this.debug(F, "could not find div with id " + middle_div_id);
		}
	  }
	  else
	  {
		this.debug(F, "could not find div with id " + id);
	  }
	}
	else
	{
	  this.debug(F, "could not find div with id " + this.template_name);
	}
  } // end method

  // --------------------------------------------------------------------
  // insert the header html into the bezel

  this.header = function(html)
  {
	var F = "header";

	var div = this.element(this.top_middle_div_id);

	if (div)
	{
	  div.innerHTML = html;
	  div.style.display = "block";
	}
	else
	{
	  this.debug(F, "could not find div with id " + this.top_middle_div_id);
	}

  } // end method

  // --------------------------------------------------------------------
  // insert the footer html into the bezel

  this.footer = function(html)
  {
	var F = "footer";

	var div = this.element(this.bottom_middle_div_id);

	if (div)
	{
	  div.innerHTML = html;
	  div.style.display = "block";
	}
	else
	{
	  this.debug(F, "could not find div with id " + this.bottom_middle_div_id);
	}

  } // end method

} // end class

