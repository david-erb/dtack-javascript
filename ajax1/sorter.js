// --------------------------------------------------------------------
// class representing the page being viewed in the browser

										// inherit the base methods and variables
dtack__ajax__sorter_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack__ajax__sorter_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
dtack__ajax__sorter_c.prototype.constructor = dtack__ajax__sorter_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__ajax__sorter_c(ajax_xml, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__ajax__sorter_c";
	
                                        // caller-provided object for issuing xml commands
    this.ajax_issuer = ajax_xml;

										/* call the base class constructor helper */
	dtack__ajax__sorter_c.prototype.base.constructor.call(
	  this,
	  ajax_xml.dtack_environment,
	  classname != undefined? classname: F);

	this.push_class_hierarchy(F);
  }
  
} // end constructor


// -------------------------------------------------------------------------------
// this can be called in the head, possibly before any dom elements are loaded

dtack__ajax__sorter_c.prototype.initialize = function(options)
{
  var F = "initialize";

  this.debug(F, "initializing draggable grid sort " + this.option_keys_text(options));

} // end function


// -------------------------------------------------------------------------------
// allow drag/drop grid sorting

dtack__ajax__sorter_c.prototype.activate = function(options)
{
  var F = "activate";
                                        // nag if feature not enabled
  dtack_javascript_utility_feature_check("dtack_javascript ajax_sorter");
  
  var table_selector = this.option_value(options, "draggable_grid_sort_table_selector", ".dtgrid_table");
  var items = this.option_value(options, "draggable_grid_sort_items", ".dtgrid_rotating0_tr,.dtgrid_rotating1_tr");

  this.debug_verbose(F, "activating draggable grid sort " + 
    " for table_selector \"" + table_selector + "\"" +
    this.option_keys_text(options));
    
  var that = this;
  $(table_selector).children("TBODY").sortable(
    {
      cursor: "move",
      items: items,
      update: function(event, ui) {that.update(event, ui);}
	});    

} // end method

// -------------------------------------------------------------------------------

dtack__ajax__sorter_c.prototype.update = function(event, ui)
{
  var F = "update";

  var that = this;
                                        // make a list of all the grid row autoids now
  var autoid_list_order_csv = "";
  
                                        // generate new list order values for each row
  var list_order = 10000;
  
                                        // find the hidden input field in the row containing the row's autoid
  var row_id = ui.item[0].id;
  
  if (!row_id)
  {
  	this.debug(F, "no id found on dragged \"" + ui.item[0].tagName + "\" item");
  	return;
  }
                                        // determine tableschema name being sorted
  var parts = this.extract_id_parts(row_id);
  
  if (parts.table_name == "" || parts.autoid == "")
  {
  	this.debug(F, "row id \"" +  row_id + "\" found on dragged item is not of form tableshema[autoid]");
  	return;
  }
                                        // the tableschema name being dragged
  var tableschema_name = parts.table_name;
  
                                        // traverse the rows of the grid which was just sorted
  ui.item.parent().children().each(
    function(index, element)
    {
      
                                        // find the hidden input field in the row containing the row's autoid
      row_id = $(this).attr("id");

                                        // get the tableschema and autoid of the grid row we are on
      parts = that.extract_id_parts(row_id);
      
                                        // this row contains now viable row autoid (i.e. could be the header row)?
      if (parts.table_name == "" || parts.autoid == "")
      {
	  }
      	                                // row is not the same tableschema as the one being dragged?
	  else
      if (parts.table_name != tableschema_name)
      {
	  }
      	                                // only reorder rows in same tableschema
	  else
      {
      	                                // replace the rotating row style
        $(this).removeClass("dtgrid_rotating0_tr");
        $(this).removeClass("dtgrid_rotating1_tr");
        $(this).addClass("dtgrid_rotating" + ((index - 1) % 2) + "_tr");
      	
        autoid_list_order_csv += (autoid_list_order_csv == ""? "": ",") + parts.autoid;
        autoid_list_order_csv += ":" + list_order;
      
                                        // update the input textbox in the row containing the current list order (if any)
        $(this).find(".dtack_list_order").val(list_order);
        list_order += 10;
	  }
	}
  );
  
  this.debug(F, "updating " + tableschema_name + " list order: {" + autoid_list_order_csv + "}");

  if (autoid_list_order_csv != "")
  {
                                        // issue the command to update the list order in each row
    this.ajax_issuer.issue_command(
      "update_list_order", 
      "<tableschema_name>" + tableschema_name + "</tableschema_name>" +
      "<autoid_list_order_csv>" + autoid_list_order_csv + "</autoid_list_order_csv>");
  }
  
} // end method
  