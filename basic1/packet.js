// --------------------------------------------------------------------

										// inherit the base methods and variables
dtack__basic__packet_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack__basic__packet_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
dtack__basic__packet_c.prototype.constructor = dtack__basic__packet_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__basic__packet_c(dtack_environment, name, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__basic__packet_c";

										/* call the base class constructor helper */
	dtack__basic__packet_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  classname != undefined? classname: F);
                             
	this.push_class_hierarchy(F);

	this.name = name;
    this.attribs = new Object();	  
    this.scalars = new Object();	  
    this.packets = new Array();	  
  }

} // end constructor
                                                                               

                      
// -------------------------------------------------------------------------------

dtack__basic__packet_c.prototype.add_packet = function(packet)
{
  var F = "dtack__basic__packet_c::add_packet";
  
  this.packets.push(packet);
  
  return packet;

} // end constructor
                   
// -------------------------------------------------------------------------------

dtack__basic__packet_c.prototype.new_packet = function(name)
{
  var F = "dtack__basic__packet_c::new_packet";
  
  var packet = new dtack__basic__packet_c(this.dtack_environment, name);
  
  return this.add_packet(packet);

} // end constructor
                                                                               


// -------------------------------------------------------------------------------

dtack__basic__packet_c.prototype.compose_xml = function(options, pad)
{
  var F = "dtack__basic__packet_c::compose_xml";
  
  if (pad == undefined)
    pad = "";
  
  var nl = "";
  if (!this.is_affirmative_option(options, "should_inhibit_newlines", "no"))
    nl = "\n";
    
  var xml = "";
    
  xml += pad + "<" + this.name;
  pad += "  ";
  var first = true;
  for(var k in this.attribs)
  {
    xml += nl + " ";

  	xml += pad + k + "=\"" + this.attribs[k] + "\"";
  }
  xml += ">" + nl;
  
  for (var k in this.scalars)
  {
  	xml += pad + "<" + k + ">" + this.scalars[k] + "</" + k + ">" + nl;
  }

  for (var k in this.packets)
  {
  	xml += this.packets[k].compose_xml(options, pad);
  }
    
  pad = pad.substring(2);
  
  xml += pad + "</" + this.name + ">" + nl;
  
  return xml;
  
} // end method

// -------------------------------------------------------------------------------

dtack__basic__packet_c.prototype.convert_from_jquery = function($xml)
{
  var F = "dtack__basic__packet_c::convert_from_jquery";
  
} // end method
