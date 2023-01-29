// --------------------------------------------------------------------
// class which manages the interaction between a pair of text boxes which are supposed to confirm a particular input value

										// inherit the base methods and variables
dtack__interaction__confirmation_textbox_pair_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack__interaction__confirmation_textbox_pair_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
dtack__interaction__confirmation_textbox_pair_c.prototype.constructor = dtack__interaction__confirmation_textbox_pair_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__interaction__confirmation_textbox_pair_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__interaction__confirmation_textbox_pair_c";

										/* call the base class constructor helper */
	dtack__interaction__confirmation_textbox_pair_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  classname != undefined? classname: F);
                             
	this.push_class_hierarchy(F);

    this.CONSTANTS = {}
    this.CONSTANTS.EVENTS = {};
    this.CONSTANTS.EVENTS.PRIMARY_CHANGED = "dtack__interaction__confirmation_textbox_pair_c::PRIMARY_CHANGED";

  }
  
} // end constructor
                                                             

// -------------------------------------------------------------------------------


dtack__interaction__confirmation_textbox_pair_c.prototype.activate = function(
  page, 
  $primary_textbox,
  $confirmation_container)
{
  var F = "activate";
                                        // remember the defining things as instance variables
  this.page = page;
  this.$primary_textbox = $primary_textbox;
  this.$confirmation_container = $confirmation_container;
  
  
  this.debug_verbose(F, "activating " + this.$primary_textbox.length + " " + this.vts(this.$primary_textbox.attr("id")));
  
                                        // make a new text box as an exact copy of the primary one
  this.$confirmation_textbox = this.$primary_textbox.clone();
  this.$confirmation_textbox.attr("id", this.$confirmation_textbox.attr("id") + "_confirmation");
  this.$confirmation_textbox.attr("name", this.$confirmation_textbox.attr("name") + "_confirmation");
  
                                        // with the new text box into the given container
  this.$confirmation_container.append(this.$confirmation_textbox);
                                                              
  this._data_entry_objects = new Array();

                                        // create a data entry object to handle validation of confirmed value
  this._data_entry_objects.push(new dtack__data_entry__text_c(
    this.dtack_environment, 
    this.$confirmation_textbox,
    {
      $other_textbox: this.$primary_textbox,
      validation_negative_message: "confirmation does not match"
	}
  ));                  

} // end method
                                       
// -------------------------------------------------------------------------------
// this is called before any post

dtack__interaction__confirmation_textbox_pair_c.prototype.validate = function(options)
{
  var F = "dtack__interaction__confirmation_textbox_pair_c::validate";                                                           

  this.debug_verbose(F, "validate " + this.option_keys_text(options));

                                        // validate the data entry objects defined in this interaction
  var is_valid = true;                           
  for(var k in this._data_entry_objects)
  {
  	var data_entry_object = this._data_entry_objects[k];
    var data_entry_is_valid = data_entry_object.validate();
    this.debug_verbose(F, "validated " + data_entry_object.$selector.attr("id") + " with " + data_entry_is_valid);
    is_valid &= data_entry_is_valid;
  }
              
  //this.debug_verbose(F, "validated " + this._data_entry_objects.length + " data entry objects");

                                        // all things must be valid for the page to be valid
  return is_valid;

} // end function  
                                                                                                             