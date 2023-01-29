// --------------------------------------------------------------------
// class representing the page being viewed in the browser

										// inherit the base methods and variables
dtack__gmap__base_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack__gmap__base_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
dtack__gmap__base_c.prototype.constructor = dtack__gmap__base_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__gmap__base_c(dtack_environment, input_selector, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__gmap__base_c";

										/* call the base class constructor helper */
	dtack__gmap__base_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  classname != undefined? classname: F);
  }
  
  this.input_selector = input_selector;

  this.participants = null;
  
  this.is_attached = false;
  this.is_dirty = false;
  
  this.map = null;
  
} // end constructor


// -------------------------------------------------------------------------------


dtack__gmap__base_c.prototype.activate = function(participants, options)
{
  var F = "activate";
  
  var that = this;
  
  this.assert("participants is " + this.vts(participants), participants);
  
                                        // remember the participants manager who is coordinating us
  this.participants = participants;
  
                                        // keep a reference to the map we are participating in
  this.map = this.participants.peek_map();
  
  if (false)
  {
                                        // location the participation area container by naming convention
    this.$participation = this.$require(this.input_selector + "_participation");

    var html = "";
  
    html += "<div class=\"dtack_gmap_participant\">";
    html += "<div class=\"T_icon T_detached\"></div>";
    html += "</div>";
  
                                        // drop in the participation html
    this.$participation.html(html);
  }
  
                                        // handle click on the shared map
  google.maps.event.addListener(
    this.map, "click", 
    function(event) 
    {
      if (that.is_attached)
      {
      	that.debug("click", "click handled for " + that.input_selector + " because attached");
        that.clicked(event);
	  }
      else
      {
      	that.debug("click", "click ignored for " + that.input_selector + " because not attached (" + that.attached + ")");
	  }
      
	}
  );

} // end method


// -------------------------------------------------------------------------------
dtack__gmap__base_c.prototype.clicked = function(event)
{
  var F = "dtack__gmap__base_c::click";
  
  this.debug(F, "base click handled for " + this.input_selector);
  
} // end method


// -------------------------------------------------------------------------------
dtack__gmap__base_c.prototype.show = function()
{
  var F = "dtack__gmap__base_c::show";
  
  //this.debug(F, "base show " + this.input_selector);
  
} // end method


// -------------------------------------------------------------------------------
dtack__gmap__base_c.prototype.hide = function()
{
  var F = "dtack__gmap__base_c::hide";
  
  //this.debug(F, "base hide " + this.input_selector);
  
} // end method


// -------------------------------------------------------------------------------
dtack__gmap__base_c.prototype.attach = function()
{
  this.participants.detach();
  
  this.is_attached = true;
                            
  $(".T_icon", this.$participation).removeClass("T_detached");
  $(".T_icon", this.$participation).addClass("T_attached");

} // end method

// -------------------------------------------------------------------------------
dtack__gmap__base_c.prototype.detach = function()
{
  this.is_attached = false;
    
  $(".T_icon", this.$participation).removeClass("T_attached");
  $(".T_icon", this.$participation).addClass("T_detached");

} // end method


// -------------------------------------------------------------------------------
dtack__gmap__base_c.prototype.save = function(options)
{
} // end method

