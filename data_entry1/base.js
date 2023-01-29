// --------------------------------------------------------------------

										// inherit the base methods and variables
dtack__data_entry__base_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack__data_entry__base_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
dtack__data_entry__base_c.prototype.constructor = dtack__data_entry__base_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__data_entry__base_c(dtack_environment, selector, options, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__data_entry__base_c";

										/* call the base class constructor helper */
	dtack__data_entry__base_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  classname != undefined? classname: F);
                             
	this.push_class_hierarchy(F);

    this.constructor_options = options;
  
    if (selector)
    {
      this.initialize(selector);
  
      this.activate();
	}
	  
  }
} // end constructor

// -------------------------------------------------------------------------------
dtack__data_entry__base_c.prototype.initialize = function(selector)
{
  var F = "dtack__data_entry__base_c::initialize";
  
  if (selector instanceof jQuery)
  {
    this.selector = selector.prop(this.SELECTOR_DESCRIPTOR_KEYWORD);
    
    if (!this.selector)
    {
      this.selector = "has_no_" + this.SELECTOR_DESCRIPTOR_KEYWORD;
    }
    
    this.$selector = selector;           
  }
  else
  {
    this.selector = selector;
    
    this.$selector = $(this.selector);           
  }
  	                                    // by default, the visible selector is indicated selector
  	                                    // some deriving classes, such as autocomplete, display one field but some submit a different invisible field
  this.$visible_selector = this.$selector;  	  
  
  if (this.$selector.length == 0)
  {
    this.debug_verbose(F, "no selector found for " + this.vts(this.selector));
    return;
  }
  
} // end method

// -------------------------------------------------------------------------------

dtack__data_entry__base_c.prototype.activate = function()
{
  var F = "dtack__data_entry__base_c::activate";
  	                                              
  this.debug_verbose(F, "activating " + this.selector + " length " + this.$selector.length);

  	                                    // the php dtcomposer_base_c::compose_data_attributes() puts the data- things in the tag
  	                                    // dtack_page_base_c::update_record_value() adds the storage_formatter to the xml of the ajax request
  this.validator = this.$selector.attr("data-dtproperty-validator");
  this.validator_specification = this.$selector.attr("data-dtproperty-validator_specification");
  this.storage_formatter = this.$selector.attr("data-dtproperty-storage_formatter");
  this.storage_default = this.$selector.attr("data-dtproperty-storage_default");

  this.is_valid = true;
  this.input_composer_cssclass_invalid = this.$selector.attr("data-dtproperty-input_composer_cssclass_invalid");
  this.$validation_message = this.$visible_selector.siblings(".data_entry_validation_message");
  if (this.$validation_message.length == 0)
  {
    this.$validation_message = this.$visible_selector.after("<div class=\"data_entry_validation_message T_hidden\">x</div>");
    this.$validation_message = this.$visible_selector.siblings(".data_entry_validation_message");
  }
  
} // end method
                                                                                              
// -------------------------------------------------------------------------------
// called when html element value changes

dtack__data_entry__base_c.prototype.change = function(jquery_event_object)
{
  var F = "dtack__data_entry__base_c::change";
  
  //this.debug_verbose(F, "no base change for " + this.id_name_or_tag());
  
} // end method

// -------------------------------------------------------------------------------

dtack__data_entry__base_c.prototype.validate = function(options)
{
  var F = "dtack__data_entry__base_c::validate";
  
  this.debug_verbose(F, "no validation for " + this.id_name_or_tag());
  
} // end method

// -------------------------------------------------------------------------------

dtack__data_entry__base_c.prototype.render_validation = function()
{
  var F = "dtack__data_entry__base_c::render_validation";
  
  if (this.is_valid === undefined)
  {
    this.debug_verbose(F, "this.is_valid is undefined so cannot render validation for " + this.id_name_or_tag(this.$visible_selector));
    return;
  }
  
  if (!this.input_composer_cssclass_invalid)
  {
    this.debug_verbose(F, this.selector + "->input_composer_cssclass_invalid is undefined so cannot render validation for " + this.id_name_or_tag(this.$visible_selector));
    return;
  }
  
  	                                    // by default, the visible selector is indicated selector
  	                                    // some deriving classes, such as autocomplete, display one field but some submit a different invisible field
  if (this.is_valid)
  {                                                                       
    //this.debug_verbose(F, "removing class " + this.input_composer_cssclass_invalid + " from " + this.id_name_or_tag(this.$visible_selector));
  	this.$visible_selector.removeClass(this.input_composer_cssclass_invalid);
    this.$validation_message.html("");
    this.$validation_message.attr("title", "");
    this.$validation_message.removeClass("T_showing");
    this.$validation_message.addClass("T_hidden");
  }
  else
  {
    //this.debug_verbose(F, "adding class " + this.input_composer_cssclass_invalid + " to " + this.id_name_or_tag(this.$visible_selector));
  	this.$visible_selector.addClass(this.input_composer_cssclass_invalid);
    this.$validation_message.html(this.validation_negative_message);
    if (this.validation_result_object &&
        this.validation_result_object.reason)
    {
      this.$validation_message.attr("title", this.validation_result_object.reason);
	}
	else
	{
      this.$validation_message.attr("title", "");
	}
    this.$validation_message.addClass("T_showing");
    this.$validation_message.removeClass("T_hidden");
  }  
  

  
} // end method


// -------------------------------------------------------------------------------

dtack__data_entry__base_c.prototype.id_name_or_tag = function($selector)
{
  if (!$selector)
    $selector = this.$selector;
    
  var node = $selector.get(0);
  
  if (!node)
    return "(node) null";
    
  if (node.id)
    return node.id;
    
  if (node.name)
    return node.name;
    
  return "(tag) " + node.tagName;
  
} // end method
