// --------------------------------------------------------------------
// class representing a DOM table

										// inherit the base methods and variables
dtack_dom_container_visualizer_c.prototype = new dtack_base2_c();

										// override the constructor
dtack_dom_container_visualizer_c.prototype.constructor = dtack_dom_container_visualizer_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack_dom_container_visualizer_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack_dom_container_visualizer_c";

	this.parent = dtack_base2_c.prototype;

	if (classname == undefined)
	  classname = F;
										/* call the base class constructor helper */
	this.parent.constructor.call(this, dtack_environment, classname);
  }

  var expand_table_for_stuff = "no";

                                        // keep debug volume down
                                        // important for sqlite logging applications
                                        // watchfrog #140
  var verbose = false;
}

// -------------------------------------------------------------------------------
dtack_dom_container_visualizer_c.prototype.visualize = function($container)
{
  var F = "visualize";
  
  var html = "<div class=\"T_kernel\">" + this.identify($container) + "</div>\n";
  
  html = this.visualize2(html, $container);
  
  html = "<div class=\"dtack_dom_container_visualizer\">\n" + html + "</div>\n";

  return html;

} // end method

// -------------------------------------------------------------------------------
dtack_dom_container_visualizer_c.prototype.visualize2 = function(html, $container)
{
  var F = "visualize";
  
  html = this.embed(html, $container, "padding");
  html = this.embed(html, $container, "border", "width");
  html = this.embed(html, $container, "margin");

  html = "<div class=\"T_identification\">\n" + this.identify($container) + "\n</div>\n" + html;
  
  var $parent = $container.parent();
  
  if ($parent != undefined &&
      $parent.length > 0 &&
      $parent.prop("tagName") != "HTML")
  {
  	html = this.visualize2(html, $parent);
  }
  
  return html;

} // end method

// -------------------------------------------------------------------------------
dtack_dom_container_visualizer_c.prototype.embed = function(kernel, $container, css, suffix)
{
  var F = "embed";
  
  var html = "";
  
  html += "<table cellpadding=\"0\" cellspacing=\"0\">\n";
  
  html += "  <tr>\n";
  html += "    <td colspan=\"3\" class=\"T_" + css + " T_top\">" + this.css($container, css + "-top", suffix) + "</td>\n";
  html += "  </tr>\n";
  
  html += "  <tr>\n";
  html += "    <td class=\"T_" + css + " T_left\">" + this.css($container, css + "-left", suffix) + "</td>\n";
  html += "    <td class=\"T_kernel\">\n";
  html += "      " + kernel;
  html += "    </td>\n";
  html += "    <td class=\"T_" + css + " T_right\">" + this.css($container, css + "-right", suffix) + "</td>\n";
  html += "  </tr>\n";
  
  html += "  <tr>\n";
  html += "    <td colspan=\"3\" class=\"T_" + css + " T_bottom\">" + this.css($container, css + "-bottom", suffix) + "</td>\n";
  html += "  </tr>\n";
  
  html += "</table>\n";
    
  return html;

} // end method

// -------------------------------------------------------------------------------
dtack_dom_container_visualizer_c.prototype.identify = function($container)
{
  var F = "identify";

  var tag_name = $container.prop("tagName");
  var class_name = $container.prop("className");
  var id = $container.prop("id");
  
  var identification = tag_name;
  if (class_name !== undefined &&
      class_name !== "")
    identification += " class \"" + class_name + "\"";
  if (id !== undefined &&
      id !== "")
    identification += " #" + id;
    
  return identification;

} // end method

// -------------------------------------------------------------------------------
dtack_dom_container_visualizer_c.prototype.css = function($container, css, suffix)
{
  var value = $container.css(css + (suffix != undefined? "-" + suffix: ""));
  
  if (value === "undefined")
    value = "?";
  else
  if (value === "")
    value = "-";
  else
    value = parseFloat(value);
    
  return value;

} // end method
