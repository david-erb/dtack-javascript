// --------------------------------------------------------------------

										// inherit the base methods and variables
dtack__data_entry__autocomplete_c.prototype = new dtack__data_entry__field_c();

                                        // provide an explicit name for the base class
dtack__data_entry__autocomplete_c.prototype.base = dtack__data_entry__field_c.prototype;

										// override the constructor
dtack__data_entry__autocomplete_c.prototype.constructor = dtack__data_entry__autocomplete_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__data_entry__autocomplete_c(dtack_environment, selector, options, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__data_entry__autocomplete_c";

										/* call the base class constructor helper */
	dtack__data_entry__autocomplete_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  selector, options,
	  classname != undefined? classname: F);
                             
	this.push_class_hierarchy(F);
	  
  }
  
} // end constructor


// -------------------------------------------------------------------------------


dtack__data_entry__autocomplete_c.prototype.activate = function()
{
  var F = "activate";
                                        // for purposes of visibility and styles, use the actual autocomplete display field
                                        // this has to be assigned before the base class activation for the sibling div to be appended
  this.$visible_selector = $("[id='" + this.$selector.attr("id") + "_autocomplete']");     

                                                            // let the base class activate
  dtack__data_entry__autocomplete_c.prototype.base.activate.call(this);

  if (false)
  {  
    var submittable_id = this.$selector.attr("id");
    var submittable_name = this.$selector.attr("name");
    var autocomplete_id = submittable_id + "_autocomplete";
    var autocomplete_name = submittable_name + "_autocomplete";
    
    this.$selector.attr("id", autocomplete_id);
    this.$selector.attr("name", autocomplete_name);
    
    var parent = this.$selector.parent();
    
    this.$submittable = parent.append("<input type=\"text\" id=\"" + submittable_id + "\" name=\"" + submittable_name + "\">");
    this.$submittable = $("#" + submittable_id);
  }

	                                    // if there is a change on the text field, revalidate immediately
  var that = this;
  this.$selector.change(
    function(jquery_event_object)
    {
      	                                // validate and render validation failure or success
      that.validate();
    }
  );

} // end method
