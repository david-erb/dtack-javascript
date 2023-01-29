// <!-- :code_tree=ecod.core: -->
// --------------------------------------------------------------------
page_c.prototype = new dtack_javascript__harnesses__page_base_c();
page_c.prototype.base = dtack_javascript__harnesses__page_base_c.prototype;
page_c.prototype.constructor = dtack_javascript__harnesses__page_base_c;

// -------------------------------------------------------------------------------
function page_c(dtack_environment, classname)
{
  if (arguments.length > 0)
  {
    var F = "page_c";
    page_c.prototype.base.constructor.call(
      this,
      dtack_environment,
      classname != undefined? classname: F);
  }

} // end constructor


// -------------------------------------------------------------------------------
// this can be called in the head, possibly before any dom elements are loaded

page_c.prototype.initialize = function(options)
{
  var F = "page_c::initialize";

  this.debug(F, "initializing " + this.option_keys_text(options));

										// call the base class initializer 
  page_c.prototype.base.initialize.call(this, options);

} // end function  
                                                     
// -------------------------------------------------------------------------------
// this is called after all dom elements are loaded

page_c.prototype.activate = function(options)
{
  var F = "page_c::activate";

  this.debug(F, "activating " + this.option_keys_text(options));

										// call the base class activater 
  page_c.prototype.base.activate.call(this, options);

  var that = this;
                                        // wrap a data entry object around the text input
  this.text1_data_entry_object = new dtack__data_entry__autocomplete_c(this.dtack_environment, $("#text1"));
  this.text1_data_entry_object.validate();
  
  this.options = [
      {value: "ActionScript", autoid: 1},
      {value: "AppleScript", autoid: 2},
      {value: "Asp", autoid: 3},
      {value: "BASIC", autoid: 4},
      {value: "C", autoid: 5},
      {value: "C++", autoid: 6},
      {value: "Clojure", autoid: 7},
      {value: "COBOL", autoid: 8},
      {value: "ColdFusion", autoid: 9},
      {value: "Erlang", autoid: 10},
      {value: "Fortran", autoid: 11},
      {value: "Groovy", autoid: 12},
      {value: "Haskell", autoid: 13},
      {value: "Java", autoid: 14},
      {value: "JavaScript", autoid: 15},
      {value: "Lisp", autoid: 16},
      {value: "Perl", autoid: 17},
      {value: "PHP", autoid: 18},
      {value: "Python", autoid: 19},
      {value: "Ruby", autoid: 20},
      {value: "Scala", autoid: 21},
      {value: "Scheme", autoid: 22}
    ];
    
  $("#text1_autocomplete").autocomplete(
    {
      source: this.options,
      change: function(event, ui) {that.handle_DTACK__COMPOSER__AUTOCOMPLETE__CHANGED({$autocomplete: $(this), ui: ui});},
      minLength:2
    }
  );

} // end function  

                                       
// -------------------------------------------------------------------------------
// this is called before any post

page_c.prototype.validate = function(options)
{
  var F = "page_c::validate";

  this.debug(F, "validate " + this.option_keys_text(options));

										// call the base class activater 
  var is_valid = page_c.prototype.base.validate.call(this, options);
  
  if (is_valid)
  {
  	is_valid = this.text1_data_entry_object.is_valid && this.select1_data_entry_object.is_valid;
  }
  
  return is_valid;

} // end function  
                                                       