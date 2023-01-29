// --------------------------------------------------------------------
// class representing a DOM table

										// inherit the base methods and variables
dtack__menubar__bar_c.prototype = new dtack_base2_c();

										// override the constructor
dtack__menubar__bar_c.prototype.constructor = dtack__menubar__bar_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__menubar__bar_c(page, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__menubar__bar_c";

	this.parent = dtack_base2_c.prototype;

	if (classname == undefined)
	  classname = F;
										// call the base class constructor helper 
	this.parent.constructor.call(this, page.dtack_environment, classname);
	
                                        // push the class hierarchy so debug_verbose may be used
	this.push_class_hierarchy(F);
	                                                            
	this.page = page;
	
	this.initialization_options = new Object();
  }          
               
} // end constructor

// -------------------------------------------------------------------------------
dtack__menubar__bar_c.prototype.initialize = function(options)
{
  var F = "initialize";

  if (options !== undefined)
    this.initialization_options = options;
  
} // end method

// -------------------------------------------------------------------------------
dtack__menubar__bar_c.prototype.activate = function()
{
  var F = "activate";
  
  var that = this;
                                                  
  this.debug_verbose(F, "initializing menubar");
  
                                        // make the individual menus position over top of everything below them
  $(".dtack_menubar_bar .T_menu").css("position", "absolute");
  $(".dtack_menubar_bar .T_menu").css("z-index", "1001");

  var menu_options = {};
  
  menu_options["items"] =  "> :not(.T_separator)";
  
                                        // position the sub menu to be next to its parent menu
                                        // this helps the menu stay within a header area
//  menu_options["position"] =
//    {
//      position: {
//      	my: "left center",
//      	at: "right center",
//      	collision: "fit"
//	  }
//	};
                                        // let jquery menu-ize the individual menus
  $(".dtack_menubar_bar .T_menu").children("UL").menu(menu_options);
  
                                        // position the menu to fly up from the primary label
  if (false)
  $(".dtack_menubar_bar .T_menu").each(
    function()
    {
      var $primary = $(this).prev();
      // that.debug(F, "positioning menu to " + $primary.text());
      $(this).position( 
        {
          my: "left bottom",
          at: "center top",
          of: $primary,
          collision: "fit"
		}
	  );
	}
  );
                                        // handle click on a top level button
                                        // eztask #16402 toolhost: topnav bigger buttons require click to be on the actual text inside the button
  $(".dtack_menubar_bar").find(".T_primary").click(
    function(event)
    {
      that.handle_item_clicked(event, $(this));
	}
  );
                                        // handle click on a menu item
  $(".dtack_menubar_bar").find("LI").click(
    function(jquery_event_object)
    {
      that.handle_item_clicked(jquery_event_object, $(this));
	}
  );
                                        // handle show/hide of the menu on hover of the container
  $(".dtack_menubar_bar .T_primary").hover(
    function(event)
    {
      $(this).children(".T_menu").show();
	},
    function(event)
    {
      $(this).children(".T_menu").hide();
	}
  );

} // end method

// ------------------------------------------------------------------------
dtack__menubar__bar_c.prototype.handle_item_clicked = function(jquery_event_object, $item)
{
  var F = "dtack__menubar__bar_c::handle_item_clicked";
  
  jquery_event_object.preventDefault();
                                        // a primary button will have an embedded T_label
                                        // eztask #16402 toolhost: topnav bigger buttons require click to be on the actual text inside the button
  var $a = $item.find(".T_label > A");
  if ($a.length == 0)
    $a = $item.find("A");
                                        // no A tag child in the clicked item?
  if ($a.length == 0)
  {
  	this.debug_verbose(F, "no A tag in clicked item");
    return;
  }
                                        // the A tag has an onclick already?
  if ($a.attr("onclick"))
  {
  	this.debug_verbose(F, "A tag in clicked item has onclick already");
    return;
  }
        
  var href = $a.attr("href");

  this.debug_verbose(F, "A href is " + this.vts(href));
  
  if (href.substr(0, 1) != "/" &&
      href.substr(0, 4) != "http")
  {
    var root_url = this.initialization_options["root_url"];
    if (root_url != undefined)
      href = root_url + "/" + href;
  }
    
  var item_clicked_target = $a.attr("target");
  if (item_clicked_target === undefined)
  {
    item_clicked_target = this.option_value(this.initialization_options, "item_clicked_target", "_self");
  	//this.debug_verbose(F, "item_clicked_target from options is " + this.value_to_string(item_clicked_target));
  }
  else
  {
  	//this.debug_verbose(F, "item_clicked_target from attr is " + this.value_to_string(item_clicked_target));
  }
  

  try
  {  
                                        // use post instead of jump for the sake of toolhost
    this.page.post(
      {
        jquery_event_object: jquery_event_object,
        url: href,
        form: this.page.CONSTANTS.FORM_NAMES.NAVIGATION,
        should_post_crumb: "no",
        target: item_clicked_target,
        target_shift: "_blank"
	  }
    );
  }
  catch(exception)
  {
    var message;
    if (exception.name != undefined)
      message = exception.name + ": " + exception.message;
    else
      message = exception;

    this.debug(F, "cannot post to " + this.vts(href) + ": " + message);
  }

} // end method
