// --------------------------------------------------------------------

										// inherit the base methods and variables
dtack__gmap__otext_c.prototype = new dtack__gmap__output_base_c();

                                        // provide an explicit name for the base class
dtack__gmap__otext_c.prototype.base = dtack__gmap__output_base_c.prototype;

										// override the constructor
dtack__gmap__otext_c.prototype.constructor = dtack__gmap__otext_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__gmap__otext_c(dtack_environment, name, definition, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__gmap__otext_c";

										/* call the base class constructor helper */
	dtack__gmap__otext_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  name,
	  definition,
	  classname != undefined? classname: F);
  }
  
} // end constructor


// -------------------------------------------------------------------------------

dtack__gmap__otext_c.prototype.activate = function(participants, options)
{
  var F = "activate";
                                        // let the base class activate
  dtack__gmap__otext_c.prototype.base.activate.call(this, participants, options);
  
                                        // get the actual geo position of the marker
  var latlng = this.unserialize_latlng(this.definition.latlng);

  if (latlng !== null)
  {
  	var that = this;
  	
    this.debug(F, "activating otext " + this.vts(this.definition.text) + " at " + latlng.toString());

  	                                    // make a new otext on the map
    this.otext = new TxtOverlay(
      latlng, 
      this.definition.text, 
      this.definition.css_class, 
      this.map, 
      {
      	hover_text: this.definition.hover_text,
                                        // handle click on the DIV in the custom overlay
      	click: function(event) 
          {
            that.clicked(event);
	      }
	  }
	);
	
//	if (this.definition.click_post_options !== undefined)
//	{
//      google.maps.event.addListener(
//        this.otext, 
//        "click", 
//        function() {global_page_object.post(that.definition.click_post_options);});
//	}
    
//                        	
//    if (this.definition.hover_text)
//    {
//      otext.div_.title = this.definition.hover_text;
//	}
//    
//	if (this.definition.click_post_options !== undefined)
//	{
//	  $(otext.div_).click(
//	    function(event)
//	    {
//	      that.definition.click_post_options.jquery_event_object = event;
//	      global_page_object.post(
//	        that.definition.click_post_options
//	      );
//		}
//	  );
//	}
          
    this.poke_google_shape_object(this.otext);
  
  }
  
} // end method

// -------------------------------------------------------------------------------


dtack__gmap__otext_c.prototype.clicked = function(event)
{
  var F = "dtack__gmap__otext_c::clicked";
  
                                        // let the base class get the click
  dtack__gmap__otext_c.prototype.base.clicked.call(this, event);
  
  if (this.definition.click_post_options !== undefined)
  {
  	this.definition.click_post_options.jquery_event_object = event;
  	
  	//this.debug(F, "this.definition.click_post_options.url is " + this.vts(this.definition.click_post_options.url));
  	
    global_page_object.post(this.definition.click_post_options);
  }
  
} // end method
