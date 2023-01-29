// --------------------------------------------------------------------
// this class adds a checkbox for the all/none functionality to every checkbox section header
// these are generally composed by dtack.web.composer.checkboxes_c
// in addition, the widget.property.composer.sections dictionary has to be assigned
// for example see codot_ecod_shell.csw_common.widgets.projects.widgets_c::initialize_codot_cq_sections();

                                        // inherit the base methods and variables
dtack__interaction__checkbox_sections_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack__interaction__checkbox_sections_c.prototype.base = dtack_base2_c.prototype;

                                        // override the constructor
dtack__interaction__checkbox_sections_c.prototype.constructor = dtack__interaction__checkbox_sections_c;


// -------------------------------------------------------------------------------
function dtack__interaction__checkbox_sections_c(page, classname)
{
  if (arguments.length > 0)
  {
    var F = "dtack__interaction__checkbox_sections_c";
    dtack__interaction__checkbox_sections_c.prototype.base.constructor.call(
      this,
      page.dtack_environment,
      classname != undefined? classname: F);
    
    this.page = page;
                                        // enable debug_verbose to work                             
    this.push_class_hierarchy(F);
    
  }

} // end constructor


// -------------------------------------------------------------------------------
// this can be called in the head, possibly before any dom elements are loaded

dtack__interaction__checkbox_sections_c.prototype.initialize = function(options)
{
  var F = "dtack__interaction__checkbox_sections_c::initialize";

  this.debug_verbose(F, "initializing " + this.option_keys_text(options));

} // end function  
                             

// -------------------------------------------------------------------------------
// 

dtack__interaction__checkbox_sections_c.prototype.activate = function()
{
  var F = "dtack__interaction__checkbox_sections_c::activate";
  
  var $tables = $("TABLE.dtproperty_checkbox_td");
  
  var that = this;
  
  this.debug_verbose(F, "activating " + $tables.length + " tables");
  
  $tables.each(function() {that.activate_table($(this));});

  this.render();
  
} // end function  
                 
                 
// -------------------------------------------------------------------------------
// 

dtack__interaction__checkbox_sections_c.prototype.activate_table = function($table)
{
  var F = "dtack__interaction__checkbox_sections_c::activate_table";
                             
  var $sections = $(".T_dtack__web__composer__checkboxes.T_section", $table);
  
  this.debug_verbose(F, "table has " + $sections.length + " sections");
    
  var that = this;
  
  $sections.each(
    function()
    {
      $(this).prepend("<input type=\"checkbox\" class=\"category_checkbox\">");
      
                                          // get rid of the left padding so the checkbox aligns with the ones inside the section
      $(this).css("padding-left", "0px");
      
      $(this).data("checkboxes_within", new Array());
    }
  );
  
  var $section = undefined;
  
                                          // traverse all the checkboxes in the table
  $("INPUT:checkbox", $table).each(
    function()
    {
                                        // we are seeing the section header checkbox which is the start of a category?
      if ($(this).hasClass("category_checkbox"))
      {
        $section = $(this).parent();
      
        $(this).click(function() {that.handle_SECTION_CLICKED($(this).parent());});
      }
                                        // we are inside a category?
      else
      if ($section)
      {                                    
        $section.data("checkboxes_within").push($(this));
        $(this).data("checkbox_section", $section);
      }
    }
  );
  
  $sections.each(
    function()
    {
      that.debug_verbose(F, "section has " + $(this).data("checkboxes_within").length + " checkboxes within");
    }
  );
                                 
} // end function  
                 
// -------------------------------------------------------------------------------
// 

dtack__interaction__checkbox_sections_c.prototype.render = function()
{
  var F = "dtack__interaction__checkbox_sections_c::render";
  
  var $tables = $("TABLE.dtproperty_checkbox_td");
  
  this.debug_verbose(F, "rendering " + $tables.length + " tables");
  
  var that = this;
  
  $tables.each(
    function()
    {
      that.render_table($(this));
    }
  );
                                 
} // end function  

// -------------------------------------------------------------------------------
// 

dtack__interaction__checkbox_sections_c.prototype.render_table = function($table)
{
  var F = "dtack__interaction__checkbox_sections_c::render_table";
                             
  var $sections = $(".T_dtack__web__composer__checkboxes.T_section", $table);
  
  this.debug_verbose(F, "rendering " + $sections.length + " sections");
    
  var that = this;
  
  $sections.each(
    function()
    {
      that.render_section($(this));
    }
  );
                                 
} // end function  
                 
// -------------------------------------------------------------------------------
// 

dtack__interaction__checkbox_sections_c.prototype.render_section = function($section)
{
  var F = "dtack__interaction__checkbox_sections_c::render_section";

  var are_all_checked = true;
  
  var checkboxes_within = $section.data("checkboxes_within");
  
                                        // take a look at all of the checkboxes within the section
  for (var k=0; k<checkboxes_within.length; k++)
  {
    var $checkbox = checkboxes_within[k];
  
    var checked = $checkbox.prop("checked");
    
                                        // one is not checked?
    if (!checked)
      are_all_checked = false;
  }
  
  $(".category_checkbox", $section).prop("checked", are_all_checked);
                                 
} // end function  
                 
// -------------------------------------------------------------------------------
// 

dtack__interaction__checkbox_sections_c.prototype.handle_SECTION_CLICKED = function($section)
{
  var F = "dtack__interaction__checkbox_sections_c::handle_SECTION_CLICKED";
  
  var checked = $(".category_checkbox", $section).prop("checked");
  
  var checkboxes_within = $section.data("checkboxes_within");

  this.debug_verbose(F, "clicked section, checked now " + this.vts(checked) + " for " + checkboxes_within.length + " checkboxes within");
  
                                        // traverse all checkboxes within
  for (var k=0; k<checkboxes_within.length; k++)
  {
    var $checkbox = checkboxes_within[k];
                                        // this checkbox checked state is different from the one we are setting?
    if ($checkbox.prop("checked") != checked)
    {
      $checkbox.prop("checked", checked);
                                        // fire the change event so other handlers get notified
      $checkbox.change();
    }
  }
                                 
} // end function  
                 

// -------------------------------------------------------------------------------
// this is called before any post

dtack__interaction__checkbox_sections_c.prototype.validate = function(options)
{
  var F = "dtack__interaction__checkbox_sections_c::validate";                                                           

  this.debug_verbose(F, "validating " + this.option_keys_text(options));

                                        // validate the data entry objects defined on this page
  var is_valid = true;
  
                                        // all things must be valid for the page to be valid
  return is_valid;

} // end function  
                                                                                         