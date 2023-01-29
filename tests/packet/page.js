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

  var top_packet = new dtack__basic__packet_c(this.dtack_environment, "top");
  
  var inner1_packet = top_packet.new_packet("inner1");
  inner1_packet.attribs["name"] = "Joe";
  inner1_packet.attribs["id"] = "1123344";
  inner1_packet.scalars["job"] = "janitor";
  inner1_packet.scalars["age"] = "32";
  
  $("#output").text(top_packet.compose_xml());

} // end function  

