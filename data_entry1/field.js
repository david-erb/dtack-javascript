// --------------------------------------------------------------------
// class representing the page being viewed in the browser

										// inherit the base methods and variables
dtack__data_entry__field_c.prototype = new dtack__data_entry__base_c();

                                        // provide an explicit name for the base class
dtack__data_entry__field_c.prototype.base = dtack__data_entry__base_c.prototype;

										// override the constructor
dtack__data_entry__field_c.prototype.constructor = dtack__data_entry__field_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__data_entry__field_c(dtack_environment, selector, options, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__data_entry__field_c";

										/* call the base class constructor helper */
	dtack__data_entry__field_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  selector, 
	  options,
	  classname != undefined? classname: F);
                             
	this.push_class_hierarchy(F);
	  
	this.default_nonblank_negative_message = "Value required";
  }
  
} // end constructor
                                                    
                                                             
// -------------------------------------------------------------------------------
// validate and render validation failure or success

dtack__data_entry__field_c.prototype.validate = function(options)
{
  var F = "dtack__data_entry__field_c::validate";

  this.debug_verbose(F, "this.$selector.length is " + this.$selector.length);
  
  if (this.$selector.length == 0)
    return true;

  var dtproperty_nonblank = this.$selector.attr("data-dtproperty-nonblank");
  
  this.debug_verbose(F, this.$selector.attr("name") + " this.$selector.attr dtproperty-nonblank is " + this.vts(dtproperty_nonblank));
                       
                                        // C# composer does it this way
  if (this.$selector.attr("data-dtproperty-nonblank") === "1")
  {
  	if (!this.validate_nonblank(options))
  	  return this.is_valid;
  }
 
  var is_valid = true;
  var validation_negative_message = "";
  
                                        // get the validator type from the data property
  var validator = this.$selector.attr("data-dtproperty-validator");
  var validator_specification = this.$selector.attr("data-dtproperty-validator_specification");
  
                                        // html had the validator data property attribute?
  if (validator)
  {
    var value = this.peek_current_value();

    this.debug_verbose(F, "validating " + this.$selector.attr("name") + " with validator " + this.vts(validator) + " and value " + this.vts(value));
      
    //this.debug(F, this.compose_class_hierarcy_string());
    
    var result = new Object();
    
    if (validator == "nonblank")
    {
      if (value === "")
      {
      	is_valid = false
      	validation_negative_message = this.default_nonblank_negative_validation_negative_message;
	  }
    }
    else
    if (validator == "date" && value !== "")
    {
      var date = this.parse_standard_or_sql_dateonly(value);
      
      if (!date)
      {
      	is_valid = false;
      	validation_negative_message = "invalid date " + this.vts(value);
      }
	}
    else
    if (validator == "time" && value !== "")
    {
      if (!this.is_valid_time(value, result))
      {
      	is_valid = false;
      	validation_negative_message = "must be hh:mm";
      }
	}
    else
    if (validator == "fixed" && value !== "")
    {
      value = this.trim(value);
      if (!value.match(/^[-]?[0-9]?[.]?[0-9]+$/) &&
          !value.match(/^[-]?[0-9]+[.]?[0-9]?$/))
      {
          is_valid = false;
          validation_negative_message = "must be numeric";
      }
    }
    else
                                        // validator is like "suffix|jpg,png" (usually for files)
    if (validator.match(/^suffix[|]/) && value !== "")
    {
      var suffixes = validator.substring(7).split(",");
      is_valid = false;                         
      
                                        // filename against each suffix in turn
      for (var index in suffixes)
      {
        var regexp = new RegExp(suffixes[index] + "$", "i");
        if (value.match(regexp))
        {
          is_valid = true;
          break;
        }
      }
      
      if (!is_valid)
      {
         validation_negative_message = "must have suffix " + suffixes.join(" or " );
      }
    }
  }
  else
  {
    this.debug_verbose(F, "no data-dtproperty-validator for " + this.$selector.attr("id"));
  }

  this.debug_verbose(F, "poking is_valid " + this.vts(is_valid) + " with message " + this.vts(is_valid? "": validation_negative_message));
  
  this.poke_is_valid(is_valid, validation_negative_message, result)
  
  return this.is_valid;
  
} // end method

// -------------------------------------------------------------------------------
// validate and render validation failure or success

dtack__data_entry__field_c.prototype.validate_nonblank = function(options)
{
  var F = "dtack__data_entry__field_c::validate_nonblank";

  var value = this.peek_current_value();

  this.debug_verbose(F, "validating " + this.$selector.attr("id") + 
    " with peek_current_value " + this.vts(value));
    
  if (value === "")
  {
    this.poke_is_valid(false, this.default_nonblank_negative_message);
  }
  else
  {
    this.poke_is_valid(true);
  }

  return this.is_valid;
  
} // end method

// -------------------------------------------------------------------------------
// validate that date is before the given date
// eztask #15396 satwap: resolved_date input has lost the datepicker (and no future date allowed)

dtack__data_entry__field_c.prototype.validate_date_before = function(options, before_date)
{
  var F = "dtack__data_entry__field_c::validate_date_before";

                                        // we presume the current value is a parseable valid date                       
  var proposed_date = this.parse_standard_or_sql_dateonly(this.peek_current_value());
  
  var is_valid = true;
  var validation_negative_message = "";
  var result = new Object();
  
  if (proposed_date && proposed_date >= before_date)
  {
  	is_valid = false;
  	validation_negative_message = "must not be in the future";
  	result.reason =
  	  "proposed date " + this.format_date(proposed_date, {format: "mysql date only"}) +
  	  " is not before " + this.format_date(before_date, {format: "mysql date only"});
  }
  
  this.debug_verbose(F, 
    "proposed date is " + proposed_date +
  	" and before_date is " + before_date +
  	" so is_valid is " + this.vts(is_valid));
  
  this.poke_is_valid(is_valid, validation_negative_message, result)

  return is_valid;
  
} // end method

// -------------------------------------------------------------------------------
// allow calling class to specify the error message to validation fails
dtack__data_entry__field_c.prototype.poke_is_valid = function(is_valid, validation_negative_message, validation_result_object)
{
  this.is_valid = is_valid;
  
  if (this.is_valid)
  {
    this.validation_negative_message = "";
    this.validation_result_object = undefined;
  }
  else
  {
    this.validation_negative_message = validation_negative_message;
    this.validation_result_object = validation_result_object;
  }

                                        // render the current state of the validation success or failure
  this.render_validation();
  
  
} // end method

// -------------------------------------------------------------------------------
dtack__data_entry__field_c.prototype.peek_current_value = function()
{
  return this.trim(this.$selector.val());
} // end method

// -------------------------------------------------------------------------------
dtack__data_entry__field_c.prototype.poke_current_value = function(value)
{
  return this.$selector.val(value);
} // end method
