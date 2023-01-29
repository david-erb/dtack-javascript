// --------------------------------------------------------------------

										// inherit the base methods and variables
dtack__data_entry__file_c.prototype = new dtack__data_entry__field_c();

                                        // provide an explicit name for the base class
dtack__data_entry__file_c.prototype.base = dtack__data_entry__field_c.prototype;

										// override the constructor
dtack__data_entry__file_c.prototype.constructor = dtack__data_entry__file_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__data_entry__file_c(dtack_environment, selector, options, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__data_entry__file_c";

										/* call the base class constructor helper */
	dtack__data_entry__file_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  selector, 
	  options,
	  classname != undefined? classname: F);
                             
	this.push_class_hierarchy(F);
	  
  }
  
} // end constructor


// -------------------------------------------------------------------------------


dtack__data_entry__file_c.prototype.activate = function()
{
  var F = "activate";
                                                            // let the base class activate
  dtack__data_entry__file_c.prototype.base.activate.call(this);

	                                    // if there is a change on the text field, revalidate immediately
 	var that = this;
    this.$selector.change(
      function(jquery_event_object)
      {
                                        // let deriving class have a crack at the change
        that.change(jquery_event_object);
      	                                // validate and render validation failure or success
      	that.validate();
      }
    );

} // end method

// -------------------------------------------------------------------------------
// eztask #16483 Tool: revisiting a CQ, BMP or Summary page which has a picture, fails validation when submitting

dtack__data_entry__file_c.prototype.peek_current_value = function()
{
  var F = "peek_current_value";
  
                                        // let base class get value from the control itself
  value = dtack__data_entry__file_c.prototype.base.peek_current_value.call(this);
  
                                        // no file picked on this control yet?
  if (value == "")
  {
                                        // parent holding the file input control
    var $parent = this.$selector.parent();
    
                                        // dtack web composer composes this stuff into the html
    var $table = $parent.find("TABLE.T_dtack__web__composer__image_input");
    
    if ($table.length)
    {
      var $thumbnail = $table.find(".T_thumbnail");
      
      if ($thumbnail.length)
      {
        var $image = $thumbnail.find(".T_image");
    
        if ($image.length > 0)
        {
                                        // typically an image will be composed with a t=timestamp cgi argument to defeat cacheing
          value = $image.attr("src").split("?");
          value = value[0];
        }
      }
    }
  }
  
  
                                        // no file picked on this control yet?
  if (value == "")
  {
                                        // parent holding the file input control
    var $parent = this.$selector.parent();
    
                                        // dtack web composer composes this stuff into the html
                                        // eztask #16481 * Recalcitrant CARL: A Recalcitrant Prevention Plan PDF slot is required
    var $view_file = $parent.find("A.T_view_file");
    
    if ($view_file.length)
    {
      var url = $view_file.attr("href");
      
      if (url)
      {
                                        // typically an image will be composed with a t=timestamp cgi argument to defeat cacheing
        value = url.split("?");
        value = value[0];
      }
    }
  }
          
  // alert(F + ":\nvalue is " + this.vts(value));
  
  return value;
  
} // end method

// -------------------------------------------------------------------------------
// validate and render validation failure or success

dtack__data_entry__file_c.prototype.validate = function(options)
{
  var F = "dtack__data_entry__file_c::validate";
                                                            
                                        // let the base class validate
  var is_valid = dtack__data_entry__file_c.prototype.base.validate.call(this, options);
  
  return this.is_valid;
  
} // end method
