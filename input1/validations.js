// --------------------------------------------------------------------
// class representing an accumulation of entrys

										// inherit the base methods and variables
dtack_input_validations_c.prototype = new dtack_base2_c();

										// override the constructor
dtack_input_validations_c.prototype.constructor = dtack_input_validations_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack_input_validations_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack_input_validations_c";
    
										/* call the base class constructor helper */
	dtack_base2_c.prototype.constructor.call(
	  this, 
	  dtack_environment, 
	  classname != undefined? classname: F);

    this.parent = dtack_base2_c.prototype;
  }
  
  this.validations_count = 0;

} // end constructor

// -------------------------------------------------------------------------------
// can be used by panels that will have only one form in a dom1/table row

dtack_input_validations_c.prototype.initialize = function(container_node, formname)
{
  var F = "initialize";

  this.debug_identifier = formname;
  
  this.container_node = container_node;
  
  this.validations = new Object();
    
                                        // identifying forms by their name won't support radio buttons
  this.form = document.forms[formname];
  if (this.form == undefined)
  {
    //this.debug(F, "there is no form named " + formname);
    return;
  }
  if (!this.form.elements)
  {
    this.debug(F, "the form named " + formname + " has no elements");
    return;
  }
  
  for (var i=0; i<this.form.elements.length; i++)
  {
    var formfield = this.form.elements[i];
    
    if (formfield.id == undefined)
      continue;
      
    this.initialize1(formfield);
  }

} // end method

// -------------------------------------------------------------------------------
// initialize given the form node instead of its name
// used by dom1/form when stuffing a form row

dtack_input_validations_c.prototype.initialize_form = function(container_node, form)
{
  var F = "initialize";

  this.debug_identifier = form.name;
  
  this.container_node = container_node;
  
  this.validations = new Object();
    
  this.form = form;
  if (this.form == undefined)
  {
    //this.debug(F, "there is no form named " + formname);
    return;
  }
  if (!this.form.elements)
  {
    this.debug(F, "the form named " + formname + " has no elements");
    return;
  }
  
  for (var i=0; i<this.form.elements.length; i++)
  {
    var formfield = this.form.elements[i];
    
    if (formfield.id == undefined)
      continue;
      
    this.initialize1(formfield);
  }

} // end method

// -------------------------------------------------------------------------------
// 

dtack_input_validations_c.prototype.initialize1 = function(formfield)
{
  var F = "initialize1";

                                        // we already did a formfield with this id?
  if (this.validations[formfield.id] != undefined)
    return;
                                        // the validation node corresponding to the formfield
  var validation_node_id = formfield.id + "_validation";
  
                                        // search for validation node in same grandparent
//    formfield.parentNode.parentNode, 

                                        // search for validation node in given container
  var validation_node = this.first_node_with_id(
    this.container_node,
    validation_node_id);
  
  if (validation_node == undefined)
  {
    return;
  }

  var validations_string = validation_node.innerHTML;
  var specs;
  try
  {
    eval("specs = " + validations_string + ";");
  }
  catch(exception)
  {
    var summary;
  
    if (exception.name != undefined)
	  summary = exception.name + ": " + exception.message;
    else
	  summary = exception;

  	this.debug(F, "invalid validation string for " + validation_node.id + " \"" + validations_string + "\": " + summary);
  	
    specs = new Object();
  }
  
  var default_value;
  switch(formfield.type)
  {
    case "text": default_value = formfield.value; break;
    case "textarea": default_value = formfield.value; break;
    case "select-one": default_value = formfield.selectedIndex; break;
    
    case "checkbox": 
      default_value = formfield.checked? "checked": "";
      //this.debug(F, this.node_description(formfield) + " checked is \"" + formfield.checked + "\"");
    break;
  }

  this.validations[formfield.id] = {
  	"formfield": formfield,
  	"validation_node": validation_node,
  	"specs": specs,
  	"default_value": default_value
  };

  this.validations_count++;
  
  this.debug(F, "initialized input validation " + this.validations_count +
    " for " + formfield.id + " with default value \"" + default_value + "\"");
    
} // end method

// -------------------------------------------------------------------------------
// 

dtack_input_validations_c.prototype.validate = function()
{
  var F = "validate";
  
  var ok = true;
  
  for (var k in this.validations)
  {
    ok &= this.validate1(this.validations[k]);
  }
  
  return ok;
  
} // end method

// -------------------------------------------------------------------------------
// validate a single form field given its id

dtack_input_validations_c.prototype.validate1_by_id = function(id)
{
  var F = "validate1_by_id";
                                        // we know this id?
  if (this.validations[id])
  {
  	return this.validate1(this.validations[id]);
  }
  else
  {
    this.debug(F, "unable to validate field with id \"" + id + "\"");
    return true;
  }
} // end method

// -------------------------------------------------------------------------------
// validate a single form field

dtack_input_validations_c.prototype.validate1 = function(validation)
{
  var F = "validate1";
  
  var failure = "";
                                        // don't validate disabled input fields
                                        // watchfrog #90
  if (validation.formfield.disabled)
    return true;
    
  var value;
  
                                        // validating a checkbox?
  if (validation.formfield.type == "checkbox")
  {
                                        // get the value only if checked
                                        // watchfrog #127
    value = validation.formfield.checked? validation.formfield.value: "";
  }
  else
                                        // validating a radio button?
  if (validation.formfield.type == "radio")
  {
                                        // get the value from among the radio group members the one that is checked
                                        // watchfrog #81
    value = "";
    for (var i=0; i<validation.formfield.form.elements.length; i++)
    {
      if (validation.formfield.form.elements[i].name == validation.formfield.name &&
          validation.formfield.form.elements[i].checked)
        value = validation.formfield.form.elements[i].value;
    }
    
  }
  else
    value = validation.formfield.value;
  
  for (var k in validation.specs)
  {
  	var spec = validation.specs[k];
  	var spec_range;
                                        // spec is actually an object giving a range?
                                        // watchfrog #126
  	if (spec.range != undefined)
  	{
      spec_range = spec.range;
    }
    else
    {
      spec_range = spec;
    }
    failure = this.validate1_item(value, k, spec_range);
    
    if (failure != "")
    {
                                        // spec is an object giving a failure message?
      if (spec.failure != undefined)
        failure = spec.failure;
        
      break;
    }
  }
      
  if (failure != "")
  {
    this.highlight1(validation, failure);
  }
  else
  {
    this.unhighlight1(validation);
  }
  
  if (true)
  {
    this.debug(F, "validation of " + validation.formfield.name + 
       " (" + validation.formfield.type + ") value \"" + value + "\"" +
       " was " + (failure == ""? "successful": ": " + failure));
   }

  return failure == "";
  
} // end method

// -------------------------------------------------------------------------------
// highlight a single form field

dtack_input_validations_c.prototype.highlight1 = function(validation, failure)
{
  var F = "highlight1";
  
  switch(validation.formfield.type)
  {
    case "radio":
                                        // highlight a radio group 
                                        // watchfrog #116
      validation.formfield.parentNode.style.backgroundColor = "#FFCCCC";
    break;
    default:
      validation.formfield.style.backgroundColor = "#FFCCCC";
    
  }

  validation.validation_node.style.display = "";
  validation.validation_node.innerHTML = failure;

  
} // end method

// -------------------------------------------------------------------------------
// unhighlight a single form field

dtack_input_validations_c.prototype.unhighlight1 = function(validation)
{
  var F = "unhighlight1";
  
  switch(validation.formfield.type)
  {
    case "radio":
                                        // unhighlight a radio group 
                                        // watchfrog #116
      validation.formfield.parentNode.style.backgroundColor = "";
    break;
    default:
      validation.formfield.style.backgroundColor = "";
    
  }

  validation.validation_node.style.display = "none";
  validation.validation_node.innerHTML = "";
  
} // end method

// -------------------------------------------------------------------------------
// validate a single item such a required: 1 or integer: 1

dtack_input_validations_c.prototype.validate1_item = function(value, type, spec)
{
  var F = "validate1_item";
  
  var failure = "";
  
  var integer = parseInt(value);
  
  switch(type)
  {
  	case "required": 
  	  failure = value.length == 0? "a value is required": "";
  	break;
  	case "integer": 
  	  failure = !value.match(/^[-]?[0-9]+$/)? "this value must be an integer": "";
  	break;
  	case "minimum": 
  	  failure = isNaN(integer) || integer < spec? "this value must be " + spec + " or more": "";
  	break;
  	case "maximum": 
  	  failure = isNaN(integer) || integer > spec? "this value must be " + spec + " or less": "";
  	break;
    case "dateonly": 
      var date = this.parse_standard_dateonly(value);
      failure = date == undefined? "this value must be a valid date": "";
      this.debug(F, "validation of \"" + value + "\" returned \"" + failure + "\"");
    break;
    
                                       // future_day validateion
                                       // watchfrog #98
    case "future_day": 
      var date = this.parse_standard_dateonly(value);
      var today = new Date();
      var tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1, 0, 0, 0);
      if (spec == 0)
        failure = date != undefined && date >= tomorrow? "this value must be today or earlier": "";
      else
        failure = date != undefined && date < tomorrow? "this value must be after today": "";
      
    break;
    
                                       // after_day validateion
                                       // watchfrog #104
    case "after_day": 
      this.debug(F, "validating after_day \"" + spec + "\"");
      var date = this.parse_standard_dateonly(value);
      var cutoff = this.parse_standard_dateonly(spec);
      
      if (cutoff != undefined &&
          date <= cutoff)
      {
        failure = "this value must be after " + spec;
      }
      
    break;
    
                                       // on_or_after_day validateion
                                       // watchfrog #104
    case "on_or_after_day": 
      this.debug(F, "validating after_day \"" + spec + "\"");
      var date = this.parse_standard_dateonly(value);
      var cutoff = this.parse_standard_dateonly(spec);
      
      if (cutoff != undefined &&
          date < cutoff)
      {
        failure = "this value must be on or after " + spec;
      }
      
    break;
  }
  
  return failure;
  
} // end method



// -------------------------------------------------------------------------------
// watchfrog #87

dtack_input_validations_c.prototype.hide_error_conditions = function()
{
  var F = "reset";
    
  for (var k in this.validations)
  {
    this.hide_error_conditions1(this.validations[k]);
  }
  
} // end method

// -------------------------------------------------------------------------------
// 

dtack_input_validations_c.prototype.hide_error_conditions1 = function(validation)
{
  var F = "reset1";

  validation.validation_node.style.display = "none";
  
                                        // unhighlight the error glow
                                        // watchfrog #85
  this.unhighlight1(validation);

} // end method


// -------------------------------------------------------------------------------
// set all input fields to default values

dtack_input_validations_c.prototype.reset = function()
{
  var F = "reset";
    
  for (var k in this.validations)
  {
    this.reset1(this.validations[k]);
  }
  
} // end method

// -------------------------------------------------------------------------------
// validate a single form field

dtack_input_validations_c.prototype.reset1 = function(validation)
{
  var F = "reset1";
  
  //this.debug(F, "resetting " + validation.formfield.id + " which is a " + validation.formfield.type);
  
  switch(validation.formfield.type)
  {
    case "text":
      validation.formfield.value = validation.default_value;
      validation.validation_node.style.display = "none";
    break;
    case "textarea":
      validation.formfield.value = validation.default_value;
      validation.validation_node.style.display = "none";
    break;
    case "select-one":
      validation.formfield.selectedIndex = validation.default_value;
      validation.validation_node.style.display = "none";
    case "checkbox":
      validation.formfield.checked = validation.default_value == "checked";
      validation.validation_node.style.display = "none";
    break;
    case "radio":
                                        // reset radio value by searching among the radio group for one that has matching value
                                        // watchfrog #83
  	  var found = false;
  	  for (var i=0; i<validation.formfield.form.elements.length; i++)
      {
        if (validation.formfield.form.elements[i].value == validation.default_value)
        {
          //this.debug(F, "resetting " + this.node_description(validation.formfield) + " with value \"" + validation.default_value + "\"");
          validation.formfield.form.elements[i].checked = true;
          found = true;
        }
        else
        {
          validation.formfield.form.elements[i].checked = false;
        }
      }
      if (!found)
      {
        //this.debug(F, "unable to reset " + this.node_description(validation.formfield) + " with value \"" + validation.default_value + "\"");
      }

      validation.validation_node.style.display = "none";
    break;
  }
  
                                        // unhighlight the error glow
                                        // watchfrog #85
  this.unhighlight1(validation);

} // end method



// -------------------------------------------------------------------------------
// set all input fields to default values

dtack_input_validations_c.prototype.populate = function(values)
{
  var F = "populate";
    
  for (var k in this.validations)
  {
    this.populate1(this.validations[k], values[k]);
  }
  
} // end method

// -------------------------------------------------------------------------------
// validate a single form field

dtack_input_validations_c.prototype.populate1 = function(validation, value)
{
  var F = "populate1";
  
  this.debug(F, "populating " + validation.formfield.id + " which is a " + validation.formfield.type);
  switch(validation.formfield.type)
  {
    case "text":
      validation.formfield.value = value;
      validation.validation_node.style.display = "none";
    break;
    case "textarea":
      validation.formfield.value = value;
      validation.validation_node.style.display = "none";
    break;
    case "select-one":
      for (var index=0; index<validation.formfield.options.length; index++)
        if (validation.formfield.options[index].value == value)
          break;
      if (index >= validation.formfield.options.length)
        index = -1;
      validation.formfield.selectedIndex = index;
      validation.validation_node.style.display = "none";
    case "checkbox":
      validation.formfield.checked = value == validation.formfield.value;
      validation.validation_node.style.display = "none";
    break;
  }

} // end method


// -------------------------------------------------------------------------------
// return a cgi string of all validated values

dtack_input_validations_c.prototype.cgi = function()
{
  var F = "cgi";
    
  var cgi = "";
  for (var k in this.validations)
  {
  	if (cgi != "")
  	  cgi += "&";
  	  
    cgi += this.cgi1(this.validations[k]);
  }
  
  return cgi;
} // end method

// -------------------------------------------------------------------------------
// return single cgi field value

dtack_input_validations_c.prototype.cgi1 = function(validation)
{
  var F = "cgi1";
  
  var value = "";
  
  var formfield = validation.formfield;
  
  switch(formfield.type)
  {
    case "text":
      value = formfield.value;
    break
    case "textarea":
      value = formfield.value;
    break
    case "select-one":
      if (formfield.selectedIndex >= 0)
        value = formfield.options[formfield.selectedIndex].value;
    break;
    case "checkbox":
      if (formfield.checked)
        value = formfield.value;
      else
        value = "";
    break;
  }

  return validation.formfield.id + "=" + encodeURIComponent(value);

} // end method

// -------------------------------------------------------------------------------
// return single cgi field value

dtack_input_validations_c.prototype.poke_choicelist = function(id, choices)
{
  var F = "poke_choicelist";
  
  var validation = this.validations[id];
  
  if (!validation)
  {
  	this.debug(F, "can't poke choicelist because " + id + " is not a known validation");
    return;
  }
  
  if (choices == undefined)
  {
  	this.debug(F, "can't poke choicelist " + id + " because given choices is undefined");
    return;
  }
      
  var formfield = validation.formfield;
  
  if (formfield.type != "select-one")
  {
  	this.debug(F, "can't poke choicelist " + id + " because " + " formfield.type is " + formfield.type);
    return;
  }
  
  formfield.options.length = 0;
  
  for (var k in choices)
  {
    var choice = choices[k];
    
    formfield.options[formfield.options.length] = new Option(choice.showed, choice.stored);
  }

} // end method



// -------------------------------------------------------------------------------
// enable all input fields

dtack_input_validations_c.prototype.enable = function()
{
  var F = "enable";
    
  for (var k in this.validations)
  {
    this.enable1(this.validations[k]);
  }
  
} // end method

// -------------------------------------------------------------------------------
// enable a single form field

dtack_input_validations_c.prototype.enable1 = function(validation)
{
  var F = "enable1";
  
  switch(validation.formfield.type)
  {
    case "text":
    case "textarea":
    case "select-one":
    case "checkbox":
      validation.formfield.disabled = false;
    break;
    case "radio":
                                        // enable a radio group 
                                        // watchfrog #92
  	  for (var i=0; i<validation.formfield.form.elements.length; i++)
      {
        if (validation.formfield.form.elements[i].name == validation.formfield.name)
          validation.formfield.form.elements[i].disabled = false;
      }
    break;
  }

} // end method

// -------------------------------------------------------------------------------
// disable all input fields

dtack_input_validations_c.prototype.disable = function()
{
  var F = "disable";
    
  for (var k in this.validations)
  {
    this.disable1(this.validations[k]);
  }
  
} // end method

// -------------------------------------------------------------------------------
// disable a single form field

dtack_input_validations_c.prototype.disable1 = function(validation)
{
  var F = "disable1";
  
  switch(validation.formfield.type)
  {
    case "text":
    case "textarea":
    case "select-one":
    case "checkbox":
      validation.formfield.disabled = true;
    break;
    case "radio":
                                        // disable a radio group 
                                        // watchfrog #92
  	  for (var i=0; i<validation.formfield.form.elements.length; i++)
      {
        if (validation.formfield.form.elements[i].name == validation.formfield.name)
          validation.formfield.form.elements[i].disabled = true;
      }
    break;
  }
                                        // unhighlight a field when disabling it
                                        // watchfrog #91
  this.unhighlight1(validation);

} // end method
